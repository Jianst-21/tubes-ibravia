import { motion } from "framer-motion";

const StatCard = ({ title, value }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
      whileHover={{ scale: 1.03 }}
    >
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </motion.div>
  );
};

export default StatCard;
