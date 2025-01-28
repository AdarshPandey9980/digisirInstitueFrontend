import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Search } from "lucide-react";

export default function StudentsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [studentData, setStudentData] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("instituteId");
        const response = await axios.post(
          "http://localhost:8000/api/student/get-all-students",
          { instituteId: token }
        );
        if (Array.isArray(response.data.result)) {
          setStudentData(response.data.result);
        }
      } catch (err) {
        setError("Failed to fetch student data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = studentData.filter((student) =>
    Object.values(student).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const openEditDialog = (student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    setStudentData((prev) =>
      prev.map((student) =>
        student._id === editingStudent._id ? editingStudent : student
      )
    );
    setIsEditDialogOpen(false);
  };

  return (
    <div className="w-full bg-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Students</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : error ? (
        <div className="text-red-500 mt-4">{error}</div>
      ) : (
        <>
          {currentStudents.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-4 text-gray-500 font-medium">Avatar</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Name</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Email</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Address</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Contact</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="py-4 px-4">{student.name}</td>
                      <td className="py-4 px-4">{student.email}</td>
                      <td className="py-4 px-4">{student.address}</td>
                      <td className="py-4 px-4">{student.contact_number || "N/A"}</td>
                      <td className="py-4 px-4">
                        <button
                          className="text-blue-500 hover:bg-blue-50 rounded-full p-2"
                          onClick={() => openEditDialog(student)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-lg ${
                    currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Edit Student</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
                value={editingStudent.name}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, name: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, email: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Address"
                value={editingStudent.address}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, address: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Contact Number"
                value={editingStudent.contact_number}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, contact_number: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
