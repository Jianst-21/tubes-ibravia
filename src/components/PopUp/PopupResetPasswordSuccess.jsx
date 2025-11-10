import React from "react";

const PopupResetPasswordSuccess = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        <h2 className="text-lg font-bold mb-2">{message?.title}</h2>
        <p className="mb-4">{message?.text}</p>
        <button
          onClick={onClose}
          className="cursor-pointer px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PopupResetPasswordSuccess;
