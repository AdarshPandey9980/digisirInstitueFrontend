import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstituteForm = () => {
  const [instituteName, setInstituteName] = useState("");
  const [instituteAddress, setInstituteAddress] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const sendOtp = async () => {
    if (!contactNumber) {
      alert("Please enter a contact number first.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/otp/send-otp", {
        phoneNumber: contactNumber,
      });

      if (response.data.success) {
        setOtpSent(true);
        setShowOtpDialog(true);
        alert("OTP sent successfully!");
      } else {
        alert("Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert("Error sending OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/otp/verify-otp", {
        phoneNumber: contactNumber,
        otp: otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        setShowOtpDialog(false);
        alert("OTP Verified! You can now complete the form.");
      } else {
        alert("Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      alert("Error verifying OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify OTP first.");
      return;
    }

    const data = new FormData();
    data.append("institute_name", instituteName);
    data.append("address", instituteAddress);
    data.append("password", password);
    data.append("contact_number", contactNumber);
    data.append("aadharCardNumber", aadharCardNumber);
    data.append("avatar", avatar);
    data.append("email", email);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/instituteAdmin/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/institute-login");
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to submit the form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Institute Registration Form
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {!otpVerified && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                  Send OTP
                </button>
              )}
            </div>
          )}

          {otpSent && !otpVerified && showOtpDialog && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={sendOtp}
                className="mt-2 w-full text-blue-500 underline focus:outline-none"
              >
                Resend OTP
              </button>
            </div>
          )}

          {otpVerified && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Institute Name
                </label>
                <input
                  type="text"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Institute Address
                </label>
                <input
                  type="text"
                  value={instituteAddress}
                  onChange={(e) => setInstituteAddress(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={aadharCardNumber}
                  onChange={(e) => setAadharCardNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Avatar
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Submit Form
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default InstituteForm;