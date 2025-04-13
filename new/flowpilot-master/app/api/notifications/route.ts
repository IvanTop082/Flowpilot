import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { config } from '@/auth';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// Get all notifications for the current user
export async function GET() {
  try {
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const notifications = await Notification.find({ 
      email: session.user.email 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// Create a new notification (for testing)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    if (!data.title || !data.message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }
    
    await connectDB();
    
    const notification = await Notification.create({
      userId: session.user.id || 'unknown',
      email: session.user.email,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      source: data.source || 'system',
      relatedAsset: data.relatedAsset
    });
    
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
} 