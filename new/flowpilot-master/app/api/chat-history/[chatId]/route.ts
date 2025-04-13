"use server";

import { getServerSession } from "next-auth";
import { config } from "@/auth";
import { NextResponse } from "next/server";
import ChatHistory from "@/models/ChatHistory";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

// Get a specific chat history by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;
    console.log("GET chat history for:", chatId);
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      console.log("Unauthorized: No session email");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    console.log("Looking for chat with ID", chatId, "for user", session.user.email);
    
    // Find the chat history
    const chatHistory = await ChatHistory.findOne({ 
      chatId,
      userEmail: session.user.email
    }).lean();
    
    if (!chatHistory) {
      console.log("Chat history not found");
      return NextResponse.json(
        { error: "Chat history not found" },
        { status: 404 }
      );
    }
    
    console.log("Found chat history with", chatHistory.messages?.length || 0, "messages");
    return NextResponse.json({
      success: true,
      chatHistory
    });
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

// Add a message to an existing chat
export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await req.json();
    const { content, role = 'user', signature, verified, txHash } = body;
    
    // Validate input
    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }
    
    // Find the chat history
    const chatHistory = await ChatHistory.findOne({ 
      chatId,
      userEmail: session.user.email
    });
    
    if (!chatHistory) {
      return NextResponse.json(
        { error: "Chat history not found" },
        { status: 404 }
      );
    }
    
    // Add the message
    chatHistory.messages.push({
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      signature,
      verified,
      txHash
    });
    
    // Update title if this is the first user message and no title set
    if (role === 'user' && chatHistory.title === 'New Chat' && chatHistory.messages.length <= 2) {
      // Use first 5 words or 30 chars of the message as the title
      const titleText = content.split(' ').slice(0, 5).join(' ');
      chatHistory.title = titleText.length > 30 ? titleText.substring(0, 30) + '...' : titleText;
    }
    
    await chatHistory.save();
    
    return NextResponse.json({
      success: true,
      message: "Message added successfully",
      messageId: chatHistory.messages[chatHistory.messages.length - 1].id
    });
  } catch (error: any) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add message" },
      { status: 500 }
    );
  }
}

// Delete a chat history
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;
    const session = await getServerSession(config);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Delete the chat history
    const result = await ChatHistory.deleteOne({
      chatId,
      userEmail: session.user.email
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Chat history not found or not authorized to delete" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Chat history deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting chat history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete chat history" },
      { status: 500 }
    );
  }
} 