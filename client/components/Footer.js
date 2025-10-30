import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="w-full py-4 px-6 text-center text-gray-400 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p>© {new Date().getFullYear()} ChainGPT Analytics • v1.0.0</p>
    </motion.footer>
  );
};

export default Footer;
