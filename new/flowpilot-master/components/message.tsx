import React from 'react';
import { cn } from '@/lib/utils';

interface MessageProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  signature?: string;
  verified?: boolean;
  txHash?: string;
}

const Message: React.FC<MessageProps> = ({
  content,
  sender,
  timestamp,
  signature,
  verified,
  txHash,
}) => {
  return (
    <div className={cn(
      "max-w-[80%] rounded-lg p-3 relative",
      sender === "user"
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto"
        : "bg-white/10 text-white"
    )}>
      <div className="break-words">{content}</div>
      <div className="text-xs opacity-70 text-right mt-1">
        {timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default Message; 