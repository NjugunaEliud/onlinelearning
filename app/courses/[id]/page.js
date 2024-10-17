"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";

const CourseDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role'); 

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/courses/${id}`);
          setCourse(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching course:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Fetch Course",
            text: "There was an error fetching course details. Please try again.",
          });
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      console.log('Updating course with data:', course);

      const response = await axios.put(`http://localhost:3001/courses/update/${id}`, {
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        instructor: course.instructor,
        duration: course.duration,
        startDate: course.startDate,
        status: course.status,
      });

      console.log('Update response:', response);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Course Updated",
          text: "Course information has been updated successfully.",
        });
        router.push('/courses');
      }
    } catch (error) {
      console.error("Error updating course:", error.response || error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "There was an error updating the course information. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/courses/${id}`);
        Swal.fire(
          'Deleted!',
          'Course has been deleted.',
          'success'
        );
        router.push('/courses');
      } catch (error) {
        console.error("Error deleting course:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "There was an error deleting the course. Please try again.",
        });
      }
    }
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to approve this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`http://localhost:3001/courses/approve/${id}`);
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Course Approved",
            text: "The course has been approved successfully.",
          });
          router.push('/courses');
        }
      } catch (error) {
        console.error("Error approving course:", error);
        Swal.fire({
          icon: "error",
          title: "Approval Failed",
          text: error.response?.data?.message || "There was an error approving the course. Please try again.",
        });
      }
    }
  };



  if (loading) return <p className="text-center">Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Course Details</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label className="block mb-2">Course Name</label>
          <input
            type="text"
            value={course.courseName}
            onChange={(e) => setCourse({ ...course, courseName: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={course.courseDescription}
            onChange={(e) => setCourse({ ...course, courseDescription: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Instructor</label>
          <input
            type="text"
            value={course.instructor}
            onChange={(e) => setCourse({ ...course, instructor: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Duration</label>
          <input
            type="text"
            value={course.duration}
            onChange={(e) => setCourse({ ...course, duration: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Start Date</label>
          <input
            type="date"
            value={course.startDate.split("T")[0]} // To format the date correctly
            onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Status</label>
          <select
            value={course.status}
            onChange={(e) => setCourse({ ...course, status: e.target.value })}
            className="border p-2 w-full"
            disabled={userRole !== "approver"}
          >
            <option value="pending">Pending</option>
            <option value="Approved">Approved</option>

          </select>
        </div>
        {userRole === "instructor" && (
          <div className="flex justify-center">
            <button type="submit" className="mt-4 bg-gray-500 text-white p-2 rounded">
              Update Course
            </button>
          </div>

        )}
       
      </form>

      {userRole === "approver" && (
              <div className="flex justify-center">
                <button onClick={handleApprove} className="mt-4 bg-blue-500 text-white p-2 rounded">Approve</button>
              </div>
            )}


      {userRole === "instructor" && (
        <div className="flex justify-center">
          <button onClick={handleDelete} className="mt-4 bg-red-500 text-white p-2 rounded">Delete Course</button>
        </div>
      )}

    </div>
  );
};

export default CourseDetails;
