import React from "react";

function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to your Dashboard 🌍</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Eco Actions</h3>
          <p className="text-gray-600">Track your daily eco-friendly actions and contributions.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Impact Stats</h3>
          <p className="text-gray-600">See how your actions reduce carbon footprints.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Community</h3>
          <p className="text-gray-600">Connect with others working on Green projects.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
