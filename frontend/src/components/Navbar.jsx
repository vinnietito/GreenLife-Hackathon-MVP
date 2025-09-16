import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">🌱 GreenLife</h1>
      <div className="flex space-x-6">
        <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/rewards" className="hover:text-gray-200">Rewards</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
