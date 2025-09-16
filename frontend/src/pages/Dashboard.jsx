import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      navigate("/login");
      return;
    }

    api.get(`/dashboard/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        // unauthorized → force login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/login");
        } else {
          alert(err.response?.data?.error || "Failed to load dashboard");
        }
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10">
      {user ? (
        <div className="bg-white p-6 rounded-2xl shadow-md w-96 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.name} 🎉</h2>
          <p className="text-gray-600 mb-2">📧 {user.email}</p>
          <p className="text-lg mt-4">🏆 <span className="font-bold">{user.points}</span> points</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
