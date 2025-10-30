import { motion } from 'framer-motion';

const MessageBubble = ({ message, isUser }) => {
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`${isUser ? 'message-user self-end' : 'message-bot self-start'}`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      {message.content}
    </motion.div>
  );
};

export default MessageBubble;
