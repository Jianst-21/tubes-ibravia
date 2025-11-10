import React from "react";

const Navbar = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Welcome, Admin</h2>
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/40"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
