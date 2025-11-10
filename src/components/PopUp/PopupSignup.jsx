import { motion, AnimatePresence } from "framer-motion";

const PopupSignup = ({ show, message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 text-center max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {message?.title || "Success!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {message?.text || "The OTP has been sent to your email. Please Verify your account!"}
            </p>
            <button
              onClick={onClose}
              className="cursor-pointer bg-primary text-white px-5 py-2 rounded-md hover:opacity-90 transition-all duration-200"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupSignup;
