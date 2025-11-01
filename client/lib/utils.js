import crypto from 'crypto';

/**
 * Encrypts an IP address using SHA-256
 * @param {string} ip - The IP address to encrypt
 * @returns {string} - The encrypted IP address
 */
export function encryptIp(ip) {
  if (!ip) return '';
  const hash = crypto.createHash('sha256');
  const salt = process.env.IP_ENCRYPTION_SALT || 'default-salt';
  return hash.update(ip + salt).digest('hex');
}

/**
 * Generates a unique session ID
 * @returns {string} - A unique session ID
 */
export function generateSessionId() {
  return crypto.randomUUID();
}

/**
 * Generates a unique user ID
 * @returns {string} - A unique user ID
 */
export function generateUserId() {
  return crypto.randomUUID();
}

/**
 * Calculates the duration between two dates in seconds
 * @param {Date} startTime - The start time
 * @param {Date} endTime - The end time
 * @returns {number} - The duration in seconds
 */
export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  return Math.floor((endTime - startTime) / 1000);
}

/**
 * Extracts browser and device information from user agent
 * @param {string} userAgent - The user agent string
 * @returns {Object} - Object containing browser and device information
 */
export function parseUserAgent(userAgent) {
  if (!userAgent) return { browser: 'Unknown', device: 'Unknown' };
  
  // Simple browser detection
  // IMPORTANT: Check for more specific browsers before generic ones
  // Brave, Edge, and others are based on Chrome, so check them first
  let browser = 'Unknown';
  if (userAgent.includes('Firefox') && !userAgent.includes('Seamonkey')) {
    browser = 'Firefox';
  } else if (userAgent.includes('SamsungBrowser')) {
    browser = 'Samsung Browser';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Brave')) {
    browser = 'Brave';
  } else if (userAgent.includes('Chrome') && userAgent.includes('Safari')) {
    // Brave doesn't explicitly say "Brave" in user agent, but we can detect it
    // by checking for specific patterns or using navigator.brave
    // For now, if it's Chromium-based but not Opera/Edge, check if it could be Brave
    browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  }
  
  // Simple device detection
  let device = 'Unknown';
  if (userAgent.includes('Mobile')) {
    device = 'Mobile';
  } else if (userAgent.includes('Tablet')) {
    device = 'Tablet';
  } else {
    device = 'Desktop';
  }
  
  return { browser, device };
}

/**
 * Safely parses JSON
 * @param {string} str - The JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} - The parsed JSON or fallback value
 */
export function safeJsonParse(str, fallback = {}) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return fallback;
  }
}