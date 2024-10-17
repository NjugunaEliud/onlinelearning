"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withAuth from "../withAuth";
import { useRouter } from 'next/navigation';


const Home = () => {
  const router = useRouter();

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all values are filled
    if (!courseName || !courseDescription || !instructor || !duration || !startDate) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all fields before submitting.",
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/course/create', {
        courseName,
        courseDescription,
        instructor,
        duration,
        startDate,
      });

      Swal.fire({
        icon: "success",
        title: "Course Creation Successful",
        text: "Course created successfully!",
      });
      
      router.push('/courses'); 


    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Course Creation Failed",
        text: "There was an error creating the course. Please try again.",
      });
      console.error("Error creating course:", error);
    }
  };

  return (
    <div>
      <main>
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Course Creation</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Course Name */}
            <div className="flex flex-col">
              <label htmlFor="courseName" className="text-sm font-medium">
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="mt-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                placeholder="Course Title"
              />
            </div>

            {/* Course Description */}
            <div className="flex flex-col">
              <label htmlFor="courseDescription" className="text-sm font-medium">
                Course Description
              </label>
              <textarea
                id="courseDescription"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="mt-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                placeholder="Description of the course"
                rows="3"
              ></textarea>
            </div>

            {/* Instructor */}
            <div className="flex flex-col">
              <label htmlFor="instructor" className="text-sm font-medium">
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="mt-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                placeholder="Instructor Name"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                placeholder="e.g., 4 weeks"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              Create Course
            </button>
          </form>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center font-semibold">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Eliud Kamau © 2024 → */}
        </a>
      </footer>
    </div>
  );
};

export default withAuth(Home);
