import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    mobile_number: "",
    avatar: null,
  });
  const [Sentotp, setSentotp] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };
  const sendOTP = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/superAdmin/sendOtp", { name: formData.name, email: formData.email });
      if (response.status === 200) {
        setStep(2);
        setSentotp(response.data.otp);
        console.log(response.data.otp);
      }
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };
  const verifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/superAdmin/verifyOtp", {
        userotp: formData.otp,
        otp: Sentotp
      });
      if (response.status === 200) setStep(3);
    } catch (error) {
      console.error("Error verifying OTP", error);
    }
  };

  const register = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/superAdmin/register",{
        name:formData.name,
        email:formData.email,
        password:formData.password,
        mobile_number:formData.mobile_number,
        avatar:formData.avatar
      },{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200)
        navigate('/superadmin-dashboard');
    } catch (error) {
      console.error("Error registering user", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <input className="w-full p-2 border rounded mb-2" name="name" placeholder="Name" onChange={handleChange} />
          <input className="w-full p-2 border rounded mb-2" name="email" placeholder="Email" onChange={handleChange} />
          <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={sendOTP}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
          <input className="w-full p-2 border rounded mb-2" name="otp" placeholder="Enter OTP" onChange={handleChange} />
          <button className="w-full bg-green-500 text-white p-2 rounded" onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Complete Registration</h2>
          <label className="block mb-1">Password</label>
          <input className="w-full p-2 border rounded mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} />
          <label className="block mb-1">Mobile Number</label>
          <input className="w-full p-2 border rounded mb-2" name="mobile_number" placeholder="Mobile Number" onChange={handleChange} />
          <label className="block mb-1">Avatar</label>
          <input className="w-full p-2 border rounded mb-2" type="file" name="avatar" onChange={handleFileChange} />
          <button className="w-full bg-purple-500 text-white p-2 rounded" onClick={register}>Register</button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRegister;
