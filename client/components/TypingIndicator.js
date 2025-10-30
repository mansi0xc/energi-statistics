import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="message-bot self-start py-3 px-4">
      <div className="flex space-x-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 rounded-full bg-emerald-400"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;
