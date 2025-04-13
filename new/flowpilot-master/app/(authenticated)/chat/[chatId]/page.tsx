"use client"

import { useParams } from 'next/navigation';
import ChatPage from '../page';

// This component is responsible for handling chat routes with chatId parameter
export default function ChatIdPage() {
  const params = useParams();
  const chatId = params.chatId ? params.chatId as string : null;
  
  // Pass the chatId through params object
  return <ChatPage params={{ initialChatId: chatId }} />;
} 