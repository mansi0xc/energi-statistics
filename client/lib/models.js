import mongoose from 'mongoose';

// Define schemas if mongoose is available
let Session;
let Message;

// Only create models if mongoose is available (server-side)
if (mongoose) {
  try {
    // Try to get existing models first to prevent overwriting
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
        city: String,
        region: String,
        latitude: Number,
        longitude: Number,
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
}

export { Session, Message };