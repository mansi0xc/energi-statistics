import { motion } from 'framer-motion';

const MetricCard = ({ title, value, icon, color = 'emerald', onClick }) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-600 border-emerald-500/30',
    blue: 'from-blue-500 to-cyan-600 border-blue-500/30',
    purple: 'from-purple-500 to-indigo-600 border-purple-500/30',
    amber: 'from-amber-500 to-orange-600 border-amber-500/30',
  };

  const colorClass = colorClasses[color] || colorClasses.emerald;

  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-sm border ${colorClass} rounded-xl p-6 flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: `0 0 20px rgba(var(--primary), 0.3)` 
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`bg-gradient-to-r ${colorClass} w-8 h-8 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {value}
      </div>
    </motion.div>
  );
};

export default MetricCard;
