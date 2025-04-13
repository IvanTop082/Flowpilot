import mongoose, { Schema } from 'mongoose';

// Define the Message subdocument schema
const MessageSchema = new Schema({
  id: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'ai'], 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  signature: { 
    type: String 
  },
  verified: { 
    type: Boolean 
  },
  txHash: { 
    type: String 
  }
});

// Define the Chat history schema
const ChatHistorySchema = new Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ChatHistorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if the model already exists to avoid overwriting it
const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema);

export default ChatHistory; 