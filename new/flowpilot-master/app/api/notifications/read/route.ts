import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { config } from '@/auth';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// Mark one or more notifications as read
export async function POST(request: Request) {
  try {
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const { notificationIds } = await request.json();
    
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json({ error: 'Notification IDs are required' }, { status: 400 });
    }
    
    // Update the specified notifications to mark them as read
    const result = await Notification.updateMany(
      { 
        _id: { $in: notificationIds },
        email: session.user.email // Ensure user only marks their own notifications
      },
      { $set: { read: true } }
    );
    
    return NextResponse.json({ 
      success: true,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}

// Mark all notifications as read
export async function PUT() {
  try {
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Update all notifications for the user
    const result = await Notification.updateMany(
      { email: session.user.email },
      { $set: { read: true } }
    );
    
    return NextResponse.json({ 
      success: true,
      modified: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
} 