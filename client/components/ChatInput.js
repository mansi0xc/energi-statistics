import { useState } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex items-center gap-2"
    >
      <motion.div 
        className="relative flex-1"
        whileFocus={{ scale: 1.01 }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask ChainGPT anything..."
          disabled={disabled}
          className="w-full p-4 pr-12 rounded-xl bg-gray-900/70 border border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-gray-400 glow-border"
        />
      </motion.div>
      
      <motion.button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`p-4 rounded-xl ${
          message.trim() && !disabled
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
            : 'bg-gray-800 cursor-not-allowed'
        } text-white font-medium`}
        whileHover={{ scale: message.trim() && !disabled ? 1.05 : 1 }}
        whileTap={{ scale: message.trim() && !disabled ? 0.95 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        Send
      </motion.button>
    </form>
  );
};

export default ChatInput;
