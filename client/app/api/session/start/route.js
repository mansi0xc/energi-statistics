import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session } from '@/lib/models';
import { generateSessionId, encryptIp, parseUserAgent, generateUserId } from '@/lib/utils';

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
    
    // Get browser info from client (for Brave detection)
    const body = await request.json().catch(() => ({}));
    const isBrave = body.isBrave || false;
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    let { browser, device } = parseUserAgent(userAgent);
    
    // Override browser if Brave is detected on client side
    if (isBrave) {
      browser = 'Brave';
    }
    
    // Generate a unique session ID
    const sessionId = generateSessionId();
    
    // Get location info (in a real implementation, you would use an IP geolocation API)
    // For now, we'll mock this data
    const location = { country: await getCountry(ip) };
    
    // Find or create user based on encrypted IP
    let user = await User.findOne({ encryptedIp });
    
    if (!user) {
      // Create new user if not found
      user = await User.create({
        userId: generateUserId(),
        encryptedIp,
        location,
        browser,
        device,
        firstSeen: new Date(),
        lastSeen: new Date(),
        sessions: [sessionId],
        totalQuestions: 0,
        totalSessionDuration: 0
      });
    } else {
      // Update existing user
      user.lastSeen = new Date();
      user.browser = browser; // Update with latest browser
      user.device = device;   // Update with latest device
      user.sessions.push(sessionId);
      await user.save();
    }
    
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
      { error: 'Failed to start session', sessionId: `local-${Date.now()}` },
      { status: 500 }
    );
  }
}

// Get country from IP address
// In production, replace with actual API call to a service like ipinfo.io
async function getCountry(ip) {
  // For now, use the user's actual country (India) for testing
  return 'India';
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