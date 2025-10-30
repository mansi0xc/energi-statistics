import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Session } from '@/lib/models';
import { generateSessionId, encryptIp, parseUserAgent } from '@/lib/utils';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get IP address from request headers
    // In production, this might need to be adjusted based on your hosting provider
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    // Encrypt the IP address for privacy
    const encryptedIp = encryptIp(ip);
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    const { browser, device } = parseUserAgent(userAgent);
    
    // Generate a unique session ID
    const sessionId = generateSessionId();
    
    // Get location info (in a real implementation, you would use an IP geolocation API)
    // For now, we'll mock this data
    const location = await mockLocationLookup(ip);
    
    // Create a new session
    const session = await Session.create({
      sessionId,
      encryptedIp,
      browser,
      device,
      location,
      startTime: new Date(),
      questionCount: 0,
    });
    
    return NextResponse.json({ 
      sessionId, 
      message: 'Session started successfully' 
    });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}

// Mock function to simulate IP geolocation lookup
// In production, replace with actual API call to a service like ipinfo.io
async function mockLocationLookup(ip) {
  // For privacy in the mock data, we don't use the actual IP
  const locations = [
    { country: 'United States', city: 'New York', region: 'NY', latitude: 40.7128, longitude: -74.0060 },
    { country: 'United Kingdom', city: 'London', region: 'England', latitude: 51.5074, longitude: -0.1278 },
    { country: 'Japan', city: 'Tokyo', region: 'Kanto', latitude: 35.6762, longitude: 139.6503 },
    { country: 'Australia', city: 'Sydney', region: 'NSW', latitude: -33.8688, longitude: 151.2093 },
    { country: 'Germany', city: 'Berlin', region: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
  ];
  
  // Choose a random location for the mock data
  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
}

// In a real implementation, you would have a function like this:
/*
async function getLocationFromIP(ip) {
  const apiKey = process.env.IPINFO_API_KEY;
  
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('IP lookup error:', data.error);
      return null;
    }
    
    // Parse location data
    const [latitude, longitude] = data.loc ? data.loc.split(',').map(Number) : [0, 0];
    
    return {
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Error looking up IP location:', error);
    return null;
  }
}
*/
