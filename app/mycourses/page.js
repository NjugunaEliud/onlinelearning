"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";



const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem('id');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/enrollments/${studentId}`);
        setMyCourses(response.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Fetch Courses",
          text: "There was an error fetching your courses. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Enrolled Courses</h2>
        <h2 className="text-xl "><Link href='/students'>Back to course basket</Link></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myCourses.length > 0 ? (
          myCourses.map(course => (
            <div key={course.id} className="border p-4 rounded shadow bg-white">
              <h3 className="font-semibold">{course.courseName}</h3>
              <p>{course.courseDescription}</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No courses enrolled.</p>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
