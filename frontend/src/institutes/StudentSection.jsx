import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Search, Edit, Trash2 } from "lucide-react";

export default function StudentsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const instituteId = Cookies.get("instituteId");
        const response = await axios.post(
          "http://localhost:8000/api/student/get-all-students",
          { instituteId }
        );

        if (Array.isArray(response.data.result)) {
          const studentList = response.data.result;

          const detailedStudents = await Promise.all(
            studentList.map(async (student, index) => {
              try {
                const detailResponse = await axios.get(
                  `http://localhost:8000/api/student/${student.student_id}`
                );
                return { ...student, ...detailResponse.data.result, index };
              } catch (err) {
                console.error(`Error fetching details for student ${student.student_id}:`, err);
                return { ...student, error: "Details not available" };
              }
            })
          );

          setStudentData(detailedStudents);
        }
      } catch (err) {
        setError("Failed to fetch student data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleEdit = (studentId) => {
    console.log("Edit student", studentId);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:8000/api/student/${studentId}`);
        setStudentData(studentData.filter(student => student.student_id !== studentId));
      } catch (err) {
        console.error("Error deleting student", err);
      }
    }
  };

  const filteredStudents = studentData.filter((student) =>
    Object.values(student).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

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
                    <th className="py-4 px-4 text-gray-500 font-medium">#</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Avatar</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Name</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Email</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Address</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Contact</th>
                    <th className="py-4 px-4 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr key={student.student_id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{index + 1}</td>
                      <td className="py-4 px-4">
                        <img
                          src={student.avatar || "https://via.placeholder.com/40"}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="py-4 px-4">{student.name}</td>
                      <td className="py-4 px-4">{student.email}</td>
                      <td className="py-4 px-4">{student.address}</td>
                      <td className="py-4 px-4">{student.contact_number || "N/A"}</td>
                      <td className="py-4 px-4 flex gap-3">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEdit(student.student_id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(student.student_id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
