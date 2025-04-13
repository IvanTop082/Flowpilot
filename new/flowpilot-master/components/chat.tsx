import React, { useState, useRef, useEffect } from "react";
import { 
Send, 
AlertCircle,
Loader2,
BarChart3,
Shield,
TrendingUp,
Building
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from "ethers";
import { showNotification } from "@/lib/utils";
import MessageComponent from "@/components/message";
import { type Message as MessageType } from "@/types/chat";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { ChatHistoryItem, ChatProps } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

export function Chat({ 
  chatId: initialChatIdProp = null, 
  onFetchChatHistories, 
  fetchChatHistories, 
  initialChatId = null 
}: ChatProps) {
const { data: session, status } = useSession();
const { isConnected, address, connectWallet, signMessage, saveMessageOnChain, walletType, walletName, chainId, balance } = useWallet();
// Use either initialChatId or initialChatIdProp, whichever is available
const effectiveInitialChatId = initialChatId || initialChatIdProp;
const [messages, setMessages] = useState<MessageType[]>([]);
const [input, setInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isFetchingHistory, setIsFetchingHistory] = useState(false);
const [isLoadingChats, setIsLoadingChats] = useState(false);
const [ensName, setEnsName] = useState<string | null>(null);
const [saveOnChain, setSaveOnChain] = useState(false);
const [isVerifying, setIsVerifying] = useState(false);
const [authError, setAuthError] = useState<string | null>(null);
const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
const [showChatList, setShowChatList] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);
const [chatId, setChatId] = useState<string | null>(effectiveInitialChatId || null);
const router = useRouter();
const [walletActionProposal, setWalletActionProposal] = useState<any | null>(null);
const [isConfirmingAction, setIsConfirmingAction] = useState(false);
const [walletActionStatusMessage, setWalletActionStatusMessage] = useState<string | null>(null);
const [statusMessageType, setStatusMessageType] = useState<'success' | 'error'>('success');

// Check if authentication is working
useEffect(() => {
  if (status === 'loading') return;
  
  if (status === 'unauthenticated') {
    setAuthError('Please sign in to use the chat feature');
  } else {
    setAuthError(null);
    // Fetch chat histories when user is authenticated
    fetchChatHistories?.();
  }
}, [status, fetchChatHistories]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

// Fetch ENS name when address changes
useEffect(() => {
  if (address && isValidAddress(address)) {
    fetchEnsName(address);
  } else {
    setEnsName(null);
  }
}, [address]);

// Check if string is a valid Ethereum address
const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    console.error("Error validating address:", error);
    return false;
  }
};

// Scroll to bottom when messages change
useEffect(() => {
  scrollToBottom();
}, [messages]);

// Fetch all chat histories for the user
const fetchUserChatHistories = async () => {
  if (!session) return;
  
  try {
    setIsLoadingChats(true);
    const response = await fetch('/api/chat-history');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chat histories: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.chatHistories) {
      setChatHistories(data.chatHistories);
      console.log("Fetched chat histories:", data.chatHistories);
    } else {
      console.log("No chat histories found or empty response");
      setChatHistories([]);
    }
  } catch (error) {
    console.error('Error fetching chat histories:', error);
    setChatHistories([]);
  } finally {
    setIsLoadingChats(false);
  }
};

// Load a specific chat
const loadChat = async (id: string) => {
  setIsLoading(true);
  try {
    console.log(`Loading chat with ID: ${id}`);
    const response = await fetch(`/api/chat-history/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load chat: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Chat data received:', data);
    
    if (data.success && data.chatHistory && data.chatHistory.messages) {
      // Transform the messages to match our expected format
      const formattedMessages = data.chatHistory.messages.map((msg: any) => ({
        id: msg.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'assistant',
        timestamp: new Date(msg.timestamp || Date.now()),
        signature: msg.signature,
        verified: msg.verified,
        txHash: msg.txHash
      }));
      
      console.log(`Loaded ${formattedMessages.length} messages`);
      setMessages(formattedMessages);
    } else {
      console.warn('No messages found in chat history or unexpected response format', data);
      setMessages([]);
    }
  } catch (error) {
    console.error("Error loading chat:", error);
    toast({
      title: "Error loading chat",
      description: "Failed to load chat history. Please try again.",
      variant: "destructive"
    });
    setMessages([]);
  } finally {
    setIsLoading(false);
  }
};

// Fetch chat history when chatId changes
useEffect(() => {
  if (chatId) {
    loadChat(chatId);
  } else {
    // Reset to empty chat if no chatId is provided
    setMessages([]);
  }
}, [chatId]);

// Fetch ENS name for the connected wallet
const fetchEnsName = async (walletAddress: string) => {
  try {
    // Use a public provider with a proper API key or handle errors gracefully
    // Many providers require API keys for production use
    
    // Option 1: Use window.ethereum if available (user's own connected provider)
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const name = await provider.lookupAddress(walletAddress);
        setEnsName(name);
        return;
      } catch (browserProviderError) {
        console.log("Could not use browser provider for ENS lookup, falling back to public provider");
        // Continue to fallback options
      }
    }
    
    // Option 2: Try a public provider with fallback
    try {
      // Only attempt ENS lookup if we have a proper provider URL
      const providerUrl = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;
      
      // If no provider URL is available, just use the address
      if (!providerUrl) {
        console.log("No Ethereum RPC URL provided for ENS lookup");
        setEnsName(null);
        return;
      }
      
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const name = await provider.lookupAddress(walletAddress);
      setEnsName(name);
    } catch (publicProviderError) {
      console.error("Error with public provider ENS lookup:", publicProviderError);
      setEnsName(null);
    }
  } catch (error) {
    // Catch all possible errors and fail gracefully
    console.error("Error fetching ENS name:", error);
    setEnsName(null);
  }
};

// Verify a message signature
const verifySignature = (message: string, signature: string, signerAddress: string): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

const handleSendMessage = async () => {
  if (!input.trim() || !session) return;
  
  // Clear any previous wallet action proposal
  setWalletActionProposal(null);
  
  let signature: string | undefined = undefined;
  let txHash: string | undefined = undefined;
  let currentChatId = chatId;
  
  // Get message signature if wallet is connected
  if (isConnected && address) {
    signature = await signMessage(input);
  }
  
  // Save message on chain if option is selected
  if (saveOnChain && isConnected && address) {
    txHash = await saveMessageOnChain(input);
  }
  
  const userMessage: MessageType = {
    id: Date.now().toString(),
    content: input,
    sender: "user",
    timestamp: new Date(),
    signature,
    verified: signature ? true : undefined,
    txHash
  };
  
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);
  
  try {
    // Create a new chat if there isn't a chatId yet
    if (!currentChatId) {
      try {
        // Generate a new unique chat ID
        const newChatId = `chat-${Date.now()}`;
        currentChatId = newChatId;
        
        const createChatResponse = await fetch('/api/chat-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: newChatId,
            walletAddress: address,
            title: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
            message: {
              content: input,
              role: 'user',
              signature,
              verified: signature ? true : undefined,
              txHash
            }
          })
        });
        
        const createChatData = await createChatResponse.json();
        
        if (!createChatResponse.ok) {
          throw new Error(createChatData.error || "Failed to create chat");
        }
        
        // Update the URL to include the new chatId without refreshing the page
        if (window.history) {
          window.history.pushState(
            { chatId: newChatId },
            '',
            `/chat/${newChatId}`
          );
        }
        
        // If we're in a single-page app environment, also fetch chat histories to update the list
        fetchChatHistories?.();
      } catch (error) {
        console.error("Error creating chat:", error);
        toast({
          title: "Error creating chat",
          description: "Failed to create a new chat. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Add message to existing chat
      try {
        const addMessageResponse = await fetch(`/api/chat-history/${currentChatId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: input,
            role: 'user',
            signature,
            verified: signature ? true : undefined,
            txHash
          })
        });
        
        if (!addMessageResponse.ok) {
          const errorData = await addMessageResponse.json();
          throw new Error(errorData.error || "Failed to save message");
        }
      } catch (error) {
        console.error("Error saving message:", error);
        toast({
          title: "Error saving message",
          description: "Your message could not be saved. The chat will continue but may not be persisted.",
          variant: "destructive"
        });
      }
    }
    
    // Make API call to get AI response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: input,
        history: messages.slice(-10), // Send last 10 messages for context
        walletAddress: address,
        chatId: currentChatId
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const aiMessage: MessageType = {
      id: Date.now().toString(),
      content: data.message || "I'm sorry, I couldn't process your request at this time.",
      sender: "assistant",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, aiMessage]);
    
    // Now save the AI's response to the chat history
    if (currentChatId) {
      await fetch(`/api/chat-history/${currentChatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: aiMessage.content,
          role: 'assistant'
        })
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    
    // Add a failure message to the chat
    const errorMessage: MessageType = {
      id: Date.now().toString(),
      content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
      sender: "assistant",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, errorMessage]);
    
    toast({
      title: "Error communicating with AI",
      description: "There was a problem getting a response. Please try again later.",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

// New function to handle wallet action confirmation
const handleConfirmWalletAction = async () => {
  if (!walletActionProposal || !isConnected) return;
  
  setIsConfirmingAction(true);
  
  try {
    // This would be replaced with actual wallet interaction code
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure (80% success rate)
    const success = Math.random() > 0.2;
    
    if (success) {
      setStatusMessageType('success');
      setWalletActionStatusMessage(`Successfully executed ${walletActionProposal.type} of ${walletActionProposal.amount} ${walletActionProposal.from} to ${walletActionProposal.to}`);
      toast({
        title: "Transaction Successful",
        description: `Your ${walletActionProposal.type} transaction was completed successfully.`,
        variant: "default"
      });
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.error("Error confirming wallet action:", error);
    setStatusMessageType('error');
    setWalletActionStatusMessage(`Failed to execute ${walletActionProposal.type}. Please try again or contact support.`);
    toast({
      title: "Transaction Failed",
      description: "Your transaction could not be completed. Please try again later.",
      variant: "destructive"
    });
  } finally {
    setIsConfirmingAction(false);
    setWalletActionProposal(null);
  }
};

// Function to cancel wallet action
const handleCancelWalletAction = () => {
  setWalletActionProposal(null);
  
  // Add cancellation message
  setMessages((prev) => [...prev, {
    id: Date.now().toString(),
    content: "Wallet action cancelled. Is there anything else I can help you with?",
    sender: "assistant",
    timestamp: new Date(),
  }]);
};

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const openEtherscan = (txHash: string) => {
  window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
};

// Update useEffect for initialChatId changes
useEffect(() => {
  if (effectiveInitialChatId) {
    setChatId(effectiveInitialChatId);
  }
}, [effectiveInitialChatId]);

return (
  <div className="h-full flex flex-col">
    {authError ? (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center max-w-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
          <p className="text-white/70 mb-4">{authError}</p>
          <Button onClick={() => router.push('/account')} className="bg-white/10 hover:bg-white/20">
            Sign In
          </Button>
        </div>
      </div>
    ) : (
      <>
        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-white/70">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 animate-pulse">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Start a new conversation</h3>
              <p className="text-white/70 max-w-md mb-8">
                Chat with FlowPilot AI about cryptocurrency markets, portfolio optimization, or DeFi strategies.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                <div className="col-span-1 md:col-span-2 mb-2">
                  <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-3 text-left">Popular Topics</h4>
                </div>
                
                {[
                  {
                    text: "Market Analysis",
                    description: "Get the latest crypto market trends and insights",
                    icon: <BarChart3 size={18} className="text-white" />,
                    suggestions: [
                      "What's happening with ETH price today?",
                      "Analyze Bitcoin's recent market movements",
                      "Give me a market overview of DeFi tokens"
                    ]
                  },
                  {
                    text: "Risk Management",
                    description: "Strategies to protect your crypto investments",
                    icon: <Shield size={18} className="text-white" />,
                    suggestions: [
                      "How do I manage liquidation risks?", 
                      "What's the best way to hedge my crypto positions?",
                      "Explain risk management for yield farming"
                    ]
                  },
                  {
                    text: "Portfolio Optimization",
                    description: "Improve your investment allocation strategy",
                    icon: <TrendingUp size={18} className="text-white" />,
                    suggestions: [
                      "How can I optimize my DeFi portfolio?",
                      "What's an ideal allocation for a balanced crypto portfolio?",
                      "Analyze my investment strategy for long-term growth"
                    ]
                  },
                  {
                    text: "DeFi Strategies",
                    description: "Learn about decentralized finance opportunities",
                    icon: <Building size={18} className="text-white" />,
                    suggestions: [
                      "Explain liquidity mining strategies",
                      "What are the best yield farming opportunities?",
                      "How do I maximize returns in DeFi?"
                    ]
                  }
                ].map((category, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-200 group hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-500/30"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-10 w-10 rounded-lg text-white flex items-center justify-center p-2">
                        {category.icon}
                      </div>
                      <div className="text-left">
                        <h5 className="font-medium text-white group-hover:text-blue-400 transition-colors">{category.text}</h5>
                        <p className="text-xs text-white/60">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      {category.suggestions.map((suggestion, sIndex) => (
                        <button
                          key={`${index}-${sIndex}`}
                          onClick={() => {
                            setInput(suggestion);
                            setTimeout(() => {
                              const textarea = document.querySelector('textarea');
                              if (textarea) textarea.focus();
                            }, 100);
                          }}
                          className="text-left w-full text-sm py-2 px-3 rounded-lg bg-white/5 hover:bg-blue-500/20 text-white/80 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="w-full max-w-2xl mt-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-white/90 mb-2">Or type your own question</h4>
                  <div className="relative">
                    <Input 
                      placeholder="Ask anything about crypto or DeFi..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      className="bg-white/5 border-white/10 focus:border-blue-500 pl-3 pr-10 py-3 text-white"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      className="absolute right-1 top-1 p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              {/* Wallet Action Status Message */}
              {walletActionStatusMessage && (
                <div className={`p-3 rounded-lg text-sm mb-4 ${
                  statusMessageType === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-200'
                }`}>
                  {walletActionStatusMessage}
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={cn(
                      "max-w-[80%] rounded-lg p-4 relative group",
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white/10 backdrop-blur-sm text-white"
                    )}
                  >
                    <div className="break-words">
                      {message.content}
                    </div>
                    
                    {/* Message metadata */}
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      {/* Left side: timestamp */}
                      <div>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      
                      {/* Right side: verification status and transaction hash */}
                      <div className="flex items-center space-x-2">
                        {message.verified && (
                          <div className="flex items-center text-green-400" title="Message verified with wallet signature">
                            <div className="w-3 h-3 mr-1">🛡️</div>
                            <span>Verified</span>
                          </div>
                        )}
                        
                        {message.txHash && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyToClipboard(message.txHash as string)}
                              className="hover:text-blue-300 transition-colors"
                              title="Copy transaction hash"
                            >
                              <div className="w-3 h-3">📋</div>
                            </button>
                            <button
                              onClick={() => openEtherscan(message.txHash as string)}
                              className="hover:text-blue-300 transition-colors"
                              title="View on Etherscan"
                            >
                              <div className="w-3 h-3">🔗</div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Wallet Action Confirmation UI */}
              {walletActionProposal && (
                <div className="flex justify-center my-4">
                  <div className="bg-blue-800/30 border border-blue-500/50 rounded-xl p-4 max-w-xl w-full">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Wallet Action Confirmation</h4>
                    <p className="text-sm text-white/80 mb-4">
                      The AI has suggested a wallet action based on your request. Would you like to proceed?
                    </p>
                    
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleConfirmWalletAction}
                        disabled={isConfirmingAction}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isConfirmingAction ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          "Confirm Action"
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelWalletAction}
                        variant="outline"
                        className="border-white/20 text-white/70 hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        {/* Input area */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || !session}
              className="min-h-[80px] w-full resize-none bg-white/5 border-white/10 focus:border-blue-500 rounded-lg p-3 pr-16 text-white placeholder-white/50"
            />
            
            {isConnected && (
              <div className="absolute left-4 bottom-4 flex items-center space-x-2">
                <div className="flex items-center">
                  <Checkbox
                    id="saveOnChain"
                    checked={saveOnChain}
                    onChange={(e) => setSaveOnChain(e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="saveOnChain" className="text-xs cursor-pointer">
                    Save on-chain
                  </Label>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim() || !session}
              className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </>
    )}
  </div>
);
} 