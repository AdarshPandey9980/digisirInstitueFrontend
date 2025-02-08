import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InstituteDetails = () => {
  const { id } = useParams();
  const [institute, setInstitute] = useState(null);

  useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/superAdmin/get-one-institute-info/${id}`
        );
        setInstitute(response.data.result);
      } catch (error) {
        console.error("Error fetching institute details:", error);
      }
    };

    fetchInstituteDetails();
  }, [id]);

  if (!institute) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{institute.institute_name}</h2>
      <p><strong>Address:</strong> {institute.address}</p>
      <p><strong>Email:</strong> {institute.email}</p>
      <p><strong>Contact:</strong> {institute.contact_number}</p>
      <img src={institute.avatar} alt="Institute Avatar" className="w-24 h-24 rounded-full object-cover my-4" />
      
      {/* Events Section */}
      <section className="mt-6">
        <h3 className="text-xl font-bold">Events</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Event Name</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {institute.events?.length > 0 ? (
              institute.events.map((event, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{index}</td>
                  <td className="border p-2">{event.event_name}</td>
                  <td className="border p-2">{event.date}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="text-center p-2">Nothing to display</td></tr>
            )}
          </tbody>
        </table>
      </section>
      
      {/* Expenses Section */}
      <section className="mt-6">
        <h3 className="text-xl font-bold">Expenses</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {institute.expense?.length > 0 ? (
              institute.expense.map((exp, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{index}</td>
                  <td className="border p-2">{exp.description}</td>
                  <td className="border p-2">${exp.amount}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="text-center p-2">Nothing to display</td></tr>
            )}
          </tbody>
        </table>
      </section>
      
      {/* Other Sections */}
      {[{ title: "Students", data: institute.students }, { title: "Teachers", data: institute.teachers }, { title: "Library", data: institute.library }].map((section, i) => (
        <section className="mt-6" key={i}>
          <h3 className="text-xl font-bold">{section.title}</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Serial Number</th>
                <th className="border p-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {section.data?.length > 0 ? (
                section.data.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{index}</td>
                    <td className="border p-2">{item.serial_number}</td>
                    <td className="border p-2">{item.name}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center p-2">Nothing to display</td></tr>
              )}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
};

export default InstituteDetails;
