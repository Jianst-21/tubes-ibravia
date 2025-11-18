import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function PopupReservation({ show, onClose }) {
  const navigate = useNavigate();

  const handleHome = () => {
    onClose(); // Tutup popup
    navigate("/"); // Arahkan ke home
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl px-10 py-12 text-center max-w-lg w-[90%]"
          >
            <div className="flex justify-center mb-6">
              <Check className="w-20 h-20 text-blue-800" strokeWidth={3} />
            </div>

            <h2 className="text-3xl font-bold mb-2 text-gray-900">Thank You</h2>
            <p className="text-lg font-semibold mb-4 text-gray-800">
              Your Reservation is Successful
            </p>
            <p className="text-gray-600 text-justify text-sm mb-8 leading-relaxed">
              Thank you for your successful reservation with Ibravia. 
              Your reservation request has been received. Our team will reach out to you 
              shortly to arrange a house visit. Don’t forget to confirm within 7 days once we contact you.
            </p>

            <button
              onClick={handleHome}
              className="cursor-pointer bg-[#007BFF] hover:bg-[#006AE0] text-white px-6 py-2 
              rounded-md font-medium shadow-md transition"
            >
              Home
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
