import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">GreenLife</div>
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
              <Link to="/rewards" className="text-sm hover:underline">Rewards</Link>
              <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">Login</Link>
              <Link to="/register" className="text-sm hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
