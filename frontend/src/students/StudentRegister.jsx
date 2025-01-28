import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentRegisterForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentAddress: "",
    password: "",
    contactNumber: "",
    aadharCardNumber: "",
    avatar: null,
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.studentName || !formData.studentAddress || !formData.password || !formData.contactNumber || !formData.aadharCardNumber || !formData.avatar || !formData.email) {
      alert("Please fill in all fields.");
      return;
    }

    const data = new FormData();
// Append data to FormData
data.append("name", formData.studentName);
data.append("address",formData.studentAddress);
data.append("password", formData.password);
data.append("contact_number", formData.contactNumber);
data.append("aadharCardNumber", formData.aadharCardNumber);
data.append("avatar", formData.avatar); // File upload
data.append("email", formData.email);

// Log FormData contents
for (let [key, value] of data.entries()) {
  console.log(`${key}: ${value instanceof File ? value.name : value}`);
}

    try {
      const response = await axios.post(
        "http://localhost:8000/api/student/register", // Update the URL as per your backend
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure multipart header
          },
        }
      );
      navigate('/student-login'); // Navigate to the login page
      console.log(response.data);
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      alert("Failed to submit the form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Student Registration Form
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Student Name
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Student Address
            </label>
            <input
              type="text"
              name="studentAddress"
              value={formData.studentAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Aadhar Card Number
            </label>
            <input
              type="text"
              name="aadharCardNumber"
              value={formData.aadharCardNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Avatar (Upload Image)
            </label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              accept="image/*"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegisterForm;
