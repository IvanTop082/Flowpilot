"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config } from "@/auth";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import ChatHistory from "@/models/ChatHistory";
import dbConnect from "@/lib/dbConnect";
import { executeAgentQuery } from "@/lib/agent";

// 🎯 Generate AI advice and save to chat history
export async function POST(req: Request) {
  try {
    const session = await getServerSession(config);
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { message, chatId, walletAddress } = body;
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }
    
    // 1. 🧠 Generate AI response with our custom agent
    let responseText;
    
    try {
      // Format the prompt for the agent
      const prompt = `User request: ${message}\n\nProvide a helpful response about DeFi, crypto strategies, or related topics.`;
      
      // Use our custom agent instead of OpenAI
      responseText = await executeAgentQuery(prompt);
      console.log("Agent Response:", responseText);
    } catch (error) {
      console.error("Error generating agent response:", error);
      // Fallback response if agent fails
      responseText = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
    }

    // 2. 📝 Save to chat history
    try {
      await dbConnect();
      
      // Find the chat history
      let chatHistory = await ChatHistory.findOne({ 
        chatId,
        userEmail: session.user.email
      });
      
      // If it doesn't exist, create a new one with proper user details
      if (!chatHistory) {
        chatHistory = new ChatHistory({
          chatId,
          userId: session.user.id || session.user.email,
          userEmail: session.user.email,
          walletAddress,
          title: message.length > 30 ? message.substring(0, 30) + '...' : message,
          messages: []
        });
      }
      
      // Add the AI response
      chatHistory.messages.push({
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'ai',
        timestamp: new Date()
      });
      
      await chatHistory.save();
    } catch (error) {
      console.error("Error saving to chat history:", error);
      // Return an error if saving to chat history fails
      return NextResponse.json(
        { error: "Failed to save chat history" },
        { status: 500 }
      );
    }
    
    // 3. 📢 Create a notification about this advice using existing Notification model
    try {
      await connectDB();
      await Notification.create({
        userId: session.user.id || 'unknown',
        email: session.user.email,
        title: 'New Strategy Advice from Agent',
        message: `The AI agent provided advice on: "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}"`,
        type: 'info',
        source: 'agent',
        read: false
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      // Continue even if notification creation fails
    }

    // Return advice to the client
    return NextResponse.json({
      success: true,
      response: responseText,
      intent: "analyze" // Default intent
    });
  } catch (error: any) {
    console.error("Error generating advice:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate advice" },
      { status: 500 }
    );
  }
}