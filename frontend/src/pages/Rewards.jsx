import React from "react";
import api from "../api";

export default function Rewards() {
  const logActivity = async (type) => {
    try {
      const res = await api.post("/activity", { type });
      alert(`${res.data.message} (+${res.data.pointsEarned} points)`);
      // optionally refresh page or update UI by reloading dashboard page
    } catch (err) {
      alert(err.response?.data?.error || "Error logging activity");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
        <h2 className="text-2xl font-bold mb-6">Rewards</h2>
        <button onClick={() => logActivity("recycle")} className="w-full bg-green-600 text-white py-2 mb-3 rounded-lg hover:bg-green-700">♻️ Recycle (+10)</button>
        <button onClick={() => logActivity("transport")} className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">🚲 Transport (+5)</button>
      </div>
    </div>
  );
}
