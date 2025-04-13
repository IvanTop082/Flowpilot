import { Schema, model, models } from 'mongoose';

export interface INotification {
  userId: string;
  email: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  source: 'system' | 'bot' | 'market';
  read: boolean;
  relatedAsset?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['alert', 'info', 'warning', 'success'],
    default: 'info',
  },
  source: {
    type: String,
    enum: ['system', 'bot', 'market'],
    default: 'system',
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedAsset: {
    type: String,
  },
}, {
  timestamps: true,
});

export default models.Notification || model<INotification>('Notification', NotificationSchema); 