export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "assistant";
  timestamp: Date;
  signature?: string;
  verified?: boolean;
  txHash?: string;
}

export interface ChatHistoryItem {
  chatId: string;
  title: string;
  updatedAt: string;
}

export interface ChatProps {
  chatId?: string | null;
  onFetchChatHistories?: () => Promise<void>;
  fetchChatHistories?: () => void;
  initialChatId?: string | null;
} 