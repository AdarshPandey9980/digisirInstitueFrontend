import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstituteSection from './InstituteSection'


const SuperAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

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
              activeSection === "institutes"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("institutes")}
          >
            Institutes
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeSection === "teachers"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleSidebarClick("teachers")}
          >
            Teachers
          </div>
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
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center">
            <span className="ml-2 text-2xl font-bold">SuperAdmin Panel</span>
          </div>
        </div>

        {/* Render the active section */}
        {activeSection === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {/* Add dashboard-related content here */}
          </div>
        )}
        {activeSection === "institutes" && <InstituteSection />}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
