"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function CourseTable() {
    const [courses, setCourses] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:3001/courses");
                console.log(response);
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                Swal.fire({
                    icon: "error",
                    title: "Failed to Fetch Courses",
                    text: "There was an error fetching course data. Please try again.",
                });
            }
        };

        fetchCourses();
    }, []);

    const handleViewCourse = (id) => {
        router.push(`/courses/${id}`);
    };

    return (
        <div className="ms-24 me-24 mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Available Courses</h2>
                <a href="/register">
                    <button className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none">
                        Add a New Course
                    </button>
                </a>
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

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-gray-500 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Course Name</th>
                            <th className="py-2 px-4 text-left">Description</th>
                            <th className="py-2 px-4 text-left">Instructor</th>
                            <th className="py-2 px-4 text-left">Duration</th>
                            <th className="py-2 px-4 text-left">Start Date</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course.id} className="border-b">
                                    <td className="py-2 px-4">{course.courseName}</td>
                                    <td className="py-2 px-4">{course.courseDescription}</td>
                                    <td className="py-2 px-4">{course.instructor}</td>
                                    <td className="py-2 px-4">{course.duration}</td>
                                    <td className="py-2 px-4">
                                        {new Date(course.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">{course.status}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => handleViewCourse(course.id)}
                                            className="px-3 py-1 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No courses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                @media (max-width: 640px) {
                    table {
                        display: block;
                        overflow-x: auto;
                    }
                    thead,
                    tbody,
                    th,
                    td,
                    tr {
                        display: block;
                    }
                    tr {
                        margin-bottom: 15px;
                    }
                    th {
                        display: none; 
                    }
                    td {
                        text-align: right;
                        position: relative;
                        padding-left: 50%; 
                    }
                    td::before {
                        content: attr(data-label); 
                        position: absolute;
                        left: 0;
                        width: 50%;
                        padding-left: 10px;
                        text-align: left;
                        font-weight: bold;
                    }
                }
            `}</style>
        </div>
    );
}
