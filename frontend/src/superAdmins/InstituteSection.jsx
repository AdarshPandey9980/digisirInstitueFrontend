import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstituteSection = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [formData, setFormData] = useState({
    instituteName: "",
    address: "",
    email: "",
    password: "",
    contactNumber: "",
    aadharCardNumber: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/superAdmin/get-all-institute");
        setInstitutes(response.data.result);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      }
    };

    fetchInstitutes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/superAdmin/register-institute-admin",
        {
          institute_name: formData.instituteName,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          contact_number: formData.contactNumber,
          aadharCardNumber: formData.aadharCardNumber,
          avatar: formData.avatar,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Institute registered successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error registering institute:", error.response?.data || error.message);
      alert("Failed to register institute. Please try again.");
    }
  };

  const handleAvatarClick = (id) => {
    navigate(`/institute/${id}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">All Institutes</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Add Institute
          </button>
        </div>
      </div>

      {/* Institutes Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Institute Name</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {institutes.length > 0 ? (
              institutes.map((institute, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <img
                      src={institute.avatar}
                      alt="Institute Avatar"
                      className="w-12 h-12 rounded-full object-cover cursor-pointer"
                      onClick={() => handleAvatarClick(institute._id)}
                    />
                  </td>
                  <td className="px-4 py-2">{institute.institute_name}</td>
                  <td className="px-4 py-2">{institute.address}</td>
                  <td className="px-4 py-2">{institute.email}</td>
                  <td className="px-4 py-2">{institute.contact_number}</td>
                  <td className="hidden">{institute._id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  No institutes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Institute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Institute</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="instituteName"
                placeholder="Institute Name"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="aadharCardNumber"
                placeholder="Aadhar Card Number"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="file"
                name="avatar"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteSection;
