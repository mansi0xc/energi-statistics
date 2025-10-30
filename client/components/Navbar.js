import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="flex items-center">
        <motion.div
          className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          ChainGPT
        </motion.div>
      </Link>
      
      <div className="flex space-x-4">
        <Link href="/analytics">
          <motion.div
            className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-black/50 backdrop-blur-sm text-emerald-400 hover:bg-emerald-900/20 transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Analytics
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
