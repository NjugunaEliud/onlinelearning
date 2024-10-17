const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const cors = require('cors');


app.use(cors({
    origin: "http://localhost:3000" 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL connection pool
const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "@Kamaa254!@#",
    database: "onlinelearning",
});

// Test the connection
mysqlPool
    .query("SELECT 1")
    .then(() => console.log("BASE CONNECTED SUCCESSFULLY"))
    .catch((err) => console.log("DB connect failed:\n" + err));

// Start the server
app.listen(3001, () => console.log("Server running on port 3001"));

// Get all the  courses created by the instructor
app.get("/courses", async (req, res) => {
    try {
        const [courses] = await mysqlPool.query("SELECT * FROM courses");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// Get a single course by ID
app.get("/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [courses] = await mysqlPool.query("SELECT * FROM courses WHERE id = ?", [id]);
        const course = courses[0];

        if (!course) {
            return res.status(404).json({ error: `course with id ${id} not found` });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// Create a new course
app.post("/course/create", async (req, res) => {
    const { courseName, courseDescription, instructor, duration, startDate } = req.body;

    // Validation: Ensure all fields are present
    if (!courseName || !courseDescription || !instructor || !duration || !startDate) {
        return res.status(400).json({ error: "All fields (courseName, courseDescription, instructor, duration, startDate) are required." });
    }

    try {
        const sql = "INSERT INTO courses (courseName, courseDescription, instructor, duration, startDate) VALUES (?, ?, ?, ?, ?)";
        const [result] = await mysqlPool.query(sql, [courseName, courseDescription, instructor, duration, startDate]);
        res.status(201).json({ id: result.insertId, courseName, courseDescription, instructor, duration, startDate });
    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});


// Update a course
app.put("/courses/update/:id", async (req, res) => {
    const id = parseInt(req.params.id); 
    const { courseName, courseDescription, instructor, duration, startDate } = req.body;


    if (!courseName || !courseDescription || !instructor || !duration || !startDate) {
        return res.status(400).json({ error: "All fields (courseName, courseDescription, instructor, duration, startDate) are required." });
    }

    try {
      
        const sql = "UPDATE courses SET courseName = ?, courseDescription = ?, instructor = ?, duration = ?, startDate = ? WHERE id = ?";
        const [result] = await mysqlPool.query(sql, [courseName, courseDescription, instructor, duration, startDate, id]);

        if (result.affectedRows === 0) {
         
            return res.status(404).json({ error: `Course with id ${id} not found` });
        }

        res.status(200).json({ message: "Course updated successfully" });
    } catch (error) {
     
        res.status(500).json({ error: "Database error: " + error.message });
    }
});


// Delete a course
app.delete("/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const sql = "DELETE FROM courses WHERE id = ?";
        const [result] = await mysqlPool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Course with id ${id} not found` });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// Enroll a student in a course
app.post('/enrollments', async (req, res) => {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
        return res.status(422).json({ message: "Student ID and Course ID are required." });
    }

    try {
        const sql = "INSERT INTO enrolements(student_id, course_id) VALUES (?, ?)";
        const [result] = await mysqlPool.query(sql, [studentId, courseId]);
        res.status(201).json({ message: "Enrollment successful", enrollmentId: result.insertId });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// fetch students enrollments
app.get('/enrollments/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
      
        const sql = `
            SELECT c.id, c.courseName, c.courseDescription 
            FROM enrolements e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ?
        `;

        const [results] = await mysqlPool.query(sql, [studentId]);


        if (results.length === 0) {
            return res.status(404).json({ message: "No enrolled courses found." });
        }

        // Send the enrolled courses as a response
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// Approve courses
app.put('/courses/approve/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await mysqlPool.query("UPDATE courses SET status = ? WHERE id = ?", ["Approved", id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      return res.status(200).json({ message: "Course approved successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  


// User registration
app.post("/api/auth/register", async (req, res) => {
    try {
        const { role, username, email, password } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(422).json({ message: "Please fill in all fields (username, email, role and password)" });
        }

        const [rows] = await mysqlPool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await mysqlPool.query("INSERT INTO users (username, email, role , password) VALUES (?, ?, ?,?)", [username, email, role, hashedPassword]);

        return res.status(201).json({
            message: "User registered successfully",
            id: newUser.insertId,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// User login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ message: "Please fill in all fields (email and password)" });
        }

        const [rows] = await mysqlPool.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "Email or password is invalid" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Email or password is invalid" });
        }

        const accessToken = jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: "1h" });

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


