import React from "react";

function Rewards() {
  const rewards = [
    { id: 1, title: "Tree Planting Badge 🌳", desc: "Awarded for planting 10 trees" },
    { id: 2, title: "Clean Energy Champion ⚡", desc: "For using renewable energy" },
    { id: 3, title: "Plastic-Free Hero ♻️", desc: "Avoided 100 plastic items" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Rewards 🏆</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{reward.title}</h3>
            <p className="text-gray-600">{reward.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rewards;
