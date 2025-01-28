import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import StudentSection from './StudentSection'; // Import the new StudentSection component

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joiningKey, setJoiningKey] = useState("");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const navigate = useNavigate();

  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  const handleJoinClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/instituteAdmin/addMembers",
        {
          key: joiningKey,
        }
      );
      alert("Member added successfully!");
      const keyName = response.data.result?.[0]?.key_name;
      console.log("Key Name:", keyName);
      if (keyName === "studentKey") {
        navigate("/student-login");
      } else if (keyName === "parentKey") {
        navigate("/parent-login");
      } else {
        navigate("/teacher-login");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to add member. Please try again.");
    }
  };

  useEffect(() => {
    if (activeSection === "incomingRequests") {
      const fetchRequests = async () => {
        try {
          const instituteId = Cookies.get("instituteId");
          const response = await axios.post(
            "http://localhost:8000/api/instituteAdmin/get-joining-request",
            { userId: instituteId },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setIncomingRequests(response.data.request || []);
        } catch (error) {
          console.error("Error fetching incoming requests:", error);
        }
      };
      fetchRequests();
    }
  }, [activeSection]);

  const handleApproveRequest = async (email, type) => {
    try {
      const instituteId = Cookies.get("instituteId");
      let endpoint = "";
      let param = "";
  
      // Determine the endpoint and parameter key based on the request type
      if (type === "student") {
        endpoint = "aprove-student-request";
        param = "studentEmail";
      } else if (type === "parent") {
        endpoint = "aprove-parent-request";
        param = "parentEmail";
      } else if (type === "teacher") {
        endpoint = "aprove-teacher-request";
        param = "teacherEmail";
      }
  
      const requestBody = {
        [param]: email,
        userId: instituteId,
      };
  
      const response = await axios.post(
        `http://localhost:8000/api/instituteAdmin/${endpoint}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Request approved successfully!");
        setIncomingRequests((prevRequests) =>
          prevRequests.filter((request) => request.email !== email)
        );
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error approving request:", error.response?.data || error.message);
      alert("Failed to approve the request. Please try again.");
    }
  };
  

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/instituteAdmin/reject-request",
        { requestId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Request rejected successfully!");
        setIncomingRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error rejecting request:", error.response?.data || error.message);
      alert("Failed to reject the request. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-white border-r md:block">
        <nav className="p-4 space-y-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "dashboard"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("dashboard")}
          >
            Dashboard
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "incomingRequests"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("incomingRequests")}
          >
            Incoming Requests
          </div>
          {/* Add the new Students link */}
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "students"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("students")}
          >
            Students
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header with Logo and Add Member Button */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <span className="ml-2 text-2xl font-bold">DigiSir</span>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-6"
            >
              Add Member
            </button>
          </div>
        </div>

        {/* Render the active section */}
        {activeSection === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {/* Add your dashboard-related content here */}
          </div>
        )}
        {activeSection === "incomingRequests" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Incoming Requests</h2>
            {incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="border p-4 rounded-lg shadow-lg"
                  >
                    <p>
                      <strong>Name:</strong> {request.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {request.email}
                    </p>
                    <p>
                      <strong>Type:</strong> {request.type}
                    </p>
                    <button
                      onClick={() => handleApproveRequest(request.email, request.type)}
                      className="bg-green-500 text-white py-2 px-4 rounded mt-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded mt-2 ml-2"
                    >
                      Reject
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No incoming requests.</p>
            )}
          </div>
        )}
        {activeSection === "students" && <StudentSection />} {/* Render the StudentSection component */}
      </main>
    </div>
  );
};

export default Dashboard;
