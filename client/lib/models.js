import mongoose from 'mongoose';

// Define schemas if mongoose is available
let User;
let Session;
let Message;

// Only create models if mongoose is available (server-side)
if (mongoose) {
  try {
    // Try to get existing models first to prevent overwriting
    User = mongoose.models.User;
    Session = mongoose.models.Session;
    Message = mongoose.models.Message;
  } catch {
    // Define models if they don't exist
  }

  // Define Session schema if it doesn't exist
  if (!Session) {
    const sessionSchema = new mongoose.Schema({
      sessionId: {
        type: String,
        required: true,
        unique: true,
      },
      encryptedIp: {
        type: String,
        required: true,
      },
      location: {
        country: String,
      },
      browser: String,
      device: String,
      startTime: {
        type: Date,
        default: Date.now,
      },
      endTime: Date,
      duration: Number, // in seconds
      questionCount: {
        type: Number,
        default: 0,
      },
    }, { timestamps: true });

    Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
  }

  // Define Message schema if it doesn't exist
  if (!Message) {
    const messageSchema = new mongoose.Schema({
      sessionId: {
        type: String,
        required: true,
        index: true,
      },
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }, { timestamps: true });

    Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
  }
  
  // Define User schema if it doesn't exist
  if (!User) {
    const userSchema = new mongoose.Schema({
      userId: {
        type: String,
        required: true,
        unique: true,
      },
      encryptedIp: {
        type: String,
        required: true,
        unique: true,
      },
      location: {
        country: String,
      },
      browser: String,
      device: String,
      firstSeen: {
        type: Date,
        default: Date.now,
      },
      lastSeen: {
        type: Date,
        default: Date.now,
      },
      sessions: [{
        type: String, // sessionId references
      }],
      totalQuestions: {
        type: Number,
        default: 0,
      },
      totalSessionDuration: {
        type: Number,
        default: 0, // in seconds
      },
    }, { timestamps: true });

    User = mongoose.models.User || mongoose.model('User', userSchema);
  }
}

export { User, Session, Message };