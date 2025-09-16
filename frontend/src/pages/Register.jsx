import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      alert("✅ Registered successfully — please login");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full mb-3 p-2 border rounded-lg" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full mb-3 p-2 border rounded-lg" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-3 p-2 border rounded-lg" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Register</button>
      </form>
    </div>
  );
}
