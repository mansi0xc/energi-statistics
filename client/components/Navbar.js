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
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {/* GMI Logo (inline SVG) */}
          <div className="h-6 flex items-center">
            <svg viewBox="0 0 81 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto">
              <path d="M46.7754 33.2574L37.3235 15.4927H30.1514V29.5173H36.1477V24.1658L44.0367 38.9707H49.4271L57.3371 24.0163V45.8171H63.3364V15.4927H56.1643L46.7754 33.2574Z" fill="white"></path>
              <path d="M72.8906 15.4478H66.6543V45.814H72.8906V15.4478Z" fill="#00E676"></path>
              <path d="M35.5818 30.6923H33.461V30.6894H20.9405V36.8092H25.641C23.8022 39.8707 20.4456 41.9246 16.612 41.9246C10.8107 41.9246 6.09228 37.2218 6.09228 31.4398C6.09228 25.6577 10.8107 20.9549 16.612 20.9549C18.9338 20.9549 21.1655 21.7173 22.9833 23.0955C23.0103 23.1165 23.0523 23.1225 23.0973 23.1225L27.3567 18.8771C27.3477 18.8293 27.3298 18.7874 27.2968 18.7575C24.3241 16.2701 20.5506 14.8799 16.615 14.8799C7.45411 14.8799 0 22.3093 0 31.4398C0 40.5703 7.45411 47.9996 16.615 47.9996C22.1734 47.9996 27.1018 45.2671 30.1194 41.0755V45.8381H36.1877V31.2933C36.1847 30.9614 35.9147 30.6923 35.5818 30.6923Z" fill="#00E676"></path>
              <path d="M61.046 13.6188C60.4101 13.6188 59.7741 13.3766 59.2882 12.8923C58.3193 11.9266 58.3193 10.357 59.2882 9.39136L67.9842 0.724252C68.953 -0.241417 70.5279 -0.241417 71.4967 0.724252L80.0547 9.25383C81.0146 10.2105 81.0236 11.7532 80.0877 12.7219C79.1218 13.7204 77.481 13.6905 76.4942 12.7099L71.2418 7.47497C70.4109 6.64683 69.061 6.64683 68.2301 7.47497L62.7948 12.8923C62.3178 13.3766 61.6819 13.6188 61.046 13.6188Z" fill="#00E676"></path>
            </svg>
          </div>
          {/* divider */}
          <span className="text-emerald-400/80 text-sm">×</span>
          {/* ChainGPT Logo only */}
          <div className="flex items-center">
            <img
              src="https://cdn.prod.website-files.com/64354b8ce4872ad8cd1c7b04/648329053d5c25f54cbb89c2_chaingpt-logoLight-Neon-2.svg"
              alt="ChainGPT"
              className="h-6 w-auto opacity-90"
            />
          </div>
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
