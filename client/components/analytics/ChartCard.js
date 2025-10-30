import { motion } from 'framer-motion';

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        boxShadow: `0 0 20px rgba(var(--primary), 0.2)` 
      }}
    >
      <h3 className="text-gray-300 text-lg font-medium mb-4">{title}</h3>
      <div className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
