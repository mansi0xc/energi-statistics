import { motion } from 'framer-motion';

const ChartCard = ({ title, children, className = '', actions = null }) => {
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 text-lg font-medium">{title}</h3>
        {actions && (
          <div className="ml-4">
            {actions}
          </div>
        )}
      </div>
      <div className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
