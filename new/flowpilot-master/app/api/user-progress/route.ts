import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { config } from '@/auth';
import UserProgress from '@/models/UserProgress';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(config);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const progress = await UserProgress.findOne({ email: session.user.email });

    if (!progress) {
      return NextResponse.json({ message: 'No progress found' });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(config);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const progress = await UserProgress.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          ...body,
          email: session.user.email,
          userId: session.user.id,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error saving user progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 