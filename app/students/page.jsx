"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";



const StudentCourses = () => {
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const studentId = localStorage.getItem('id');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCoursesResponse = await axios.get('http://localhost:3001/courses');
                setAllCourses(allCoursesResponse.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                Swal.fire({
                    icon: "error",
                    title: "Failed to Fetch Courses",
                    text: "There was an error fetching the courses. Please try again.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [studentId]);

    const handleEnroll = async (courseId) => {
        try {
            await axios.post(`http://localhost:3001/enrollments`, { studentId, courseId });
            Swal.fire({
                icon: "success",
                title: "Enrollment Successful",
                text: "You have been enrolled in the course successfully.",
            });

        } catch (error) {
            console.error("Error enrolling in course:", error);
            Swal.fire({
                icon: "error",
                title: "Enrollment Failed",
                text: "There was an error enrolling in the course. Please try again.",
            });
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Available Courses</h2>
            <h2 className="text-xl font-bold"><Link href="mycourses">My Courses</Link></h2>
            <Link href="/profile" className="flex items-center text-gray-700 hover:text-gray-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8" // Adjust the size as needed
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14c-4.418 0-8 2.686-8 6v2h16v-2c0-3.314-3.582-6-8-6zM12 12c2.12 0 3.837-1.057 4.98-2.648C15.912 8.016 13.063 5 12 5c-1.063 0-3.912 3.016-4.98 4.352C8.163 10.943 9.88 12 12 12z"
                    />
                </svg>
                <span className="ml-2">Profile</span> {/* Text next to the icon */}
            </Link>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allCourses.map(course => (
                    <div key={course.id} className="border p-4 rounded shadow">
                        <h3 className="font-semibold">{course.courseName}</h3>
                        <p>{course.courseDescription}</p>
                        <button
                            onClick={() => handleEnroll(course.id)}
                            className="mt-2 bg-gray-500 text-white p-2 rounded"
                        >
                            Enroll
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCourses;
