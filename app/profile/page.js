"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Load user details from local storage
  useEffect(() => {
    const savedUser = {
      id: localStorage.getItem("id"),
      username: localStorage.getItem("Username"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
    };
    
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Handle form submission for updating user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/users/${user.id}`, user);
      localStorage.setItem("Username", response.data.username);
      localStorage.setItem("email", response.data.email);
      Swal.fire("Success!", "Your profile has been updated.", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error!", "There was an error updating your profile.", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">

        <h2 className="text-2xl font-bold">Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${isEditing ? "bg-white" : "bg-gray-200 cursor-not-allowed"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${isEditing ? "bg-white" : "bg-gray-200 cursor-not-allowed"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            name="role"
            value={user.role}
            onChange={handleChange}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="text"
            name="role"
            value={user.password}
            onChange={handleChange}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mr-4"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Update Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
