import { Schema, model, models } from 'mongoose';

export interface IUserProgress {
  userId: string;
  email: string;
  walletAddress?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
  notificationsEnabled?: boolean;
  selectedChains?: string[];
  onboardingCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
  },
  riskTolerance: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  notificationsEnabled: {
    type: Boolean,
    default: false,
  },
  selectedChains: [{
    type: String,
  }],
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default models.UserProgress || model<IUserProgress>('UserProgress', UserProgressSchema); 