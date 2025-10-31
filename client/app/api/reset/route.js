import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';

export async function POST() {
  try {
    // Connect to database
    await dbConnect();
    
    // Delete all data
    await Message.deleteMany({});
    await Session.deleteMany({});
    await User.deleteMany({});
    
    return NextResponse.json({ 
      success: true,
      message: 'Database reset successful. All data has been deleted.' 
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}

