import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [instituteInfo, setInstituteInfo] = useState(null); // State for institute info
  const [isJoined, setIsJoined] = useState(false); // Track if the user has joined
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [instituteKey, setInstituteKey] = useState(""); // State for the institute key

  // Fetch data from localStorage on component mount
  useEffect(() => {
    const storedInstituteInfo = localStorage.getItem("instituteInfo");
    const storedIsJoined = localStorage.getItem("isJoined");
    if (storedInstituteInfo) {
      setInstituteInfo(JSON.parse(storedInstituteInfo));
      setIsJoined(JSON.parse(storedIsJoined));
    }

    // Check the approval status when the component mounts
    const checkApprovalStatus = async () => {
      const userId = Cookies.get("userId");

      try {
        const approvalResponse = await axios.get(
          `http://localhost:8000/api/student/join-status/${userId}`
        );

        if (approvalResponse.data.status === "approved") {
          // If approved, fetch the institute info
          const instituteResponse = await axios.get(
            `http://localhost:8000/api/student/getInfo/${approvalResponse.data.instituteId}`
          );

          // Update state and save to localStorage
          setInstituteInfo(instituteResponse.data);
          setIsJoined(true);
          localStorage.setItem("instituteInfo", JSON.stringify(instituteResponse.data));
          localStorage.setItem("isJoined", true);
        } else {
          console.log("Approval status is pending.");
        }
      } catch (error) {
        console.error("Error fetching approval status or institute details:", error);
      }
    };

    checkApprovalStatus();
  }, []); // This runs once on component mount

  // Handle joining institute (submit key)
  const handleJoinInstitute = async () => {
    const userId = Cookies.get("userId");
    console.log(userId, instituteKey);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/student/join-institute`,
        { key: instituteKey, userId }
      );
      console.log(response.data);
      if (response.data) {
        setIsDialogOpen(false);
        setIsJoined(true);
        localStorage.setItem("isJoined", true);
        // Re-fetch the institute details after successful join
        // const instituteResponse = await axios.get(
        //   `http://localhost:8000/api/student/getInfo/${response.data.instituteId}`
        // );
        // setInstituteInfo(instituteResponse.data);
        // localStorage.setItem("instituteInfo", JSON.stringify(instituteResponse.data));
      } else {
        console.log("Failed to join institute.");
      }
    } catch (error) {
      console.error("Error joining institute:", error);
    }
  };

  // Sidebar click handler
  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-white border-r md:block">
        <nav className="p-4 space-y-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "overview"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("overview")}
          >
            Overview
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "courses"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("courses")}
          >
            My Courses
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "profile"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("profile")}
          >
            Profile
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <span className="ml-2 text-2xl font-bold">DigiSir</span>
          </div>
        </div>

        {/* Active Section Rendering */}
        {activeSection === "overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            {isJoined && instituteInfo ? (
              <div>
                <h3 className="text-xl font-semibold">{instituteInfo.instituteName}</h3>
                <p>
                  <strong>Location:</strong> {instituteInfo.instituteLocation}
                </p>
                <p>
                  <strong>Contact:</strong> {instituteInfo.instituteContact}
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-4">Approval is pending or no institute data available.</p>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setIsDialogOpen(true)} // Open dialog
                >
                  Join Institute
                </button>
              </div>
            )}
          </div>
        )}

        {activeSection === "courses" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <p>You are not enrolled in any courses.</p>
          </div>
        )}

        {activeSection === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Profile section content goes here.</p>
          </div>
        )}
      </main>

      {/* Join Institute Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Join Institute</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter Institute Key"
                value={instituteKey}
                onChange={(e) => setInstituteKey(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setIsDialogOpen(false)} // Close dialog
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleJoinInstitute} // Submit key to join
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
