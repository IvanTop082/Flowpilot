"use client"
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChevronDown, ArchiveRestore, AlertCircle, PanelRightClose, PanelRightOpen, Search, Sparkles, Plus } from 'lucide-react';
import { Chat } from '@/components/chat';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string; // ISO date string
  messages: Message[];
}

interface ChatPageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
}

const ChatPage = ({ params, searchParams }: ChatPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [previousChats, setPreviousChats] = useState<ChatSession[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Session protection - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/account');
    }
  }, [status, router]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    if (!session?.user?.email) return;
    
    try {
      setLoadingChats(true);
      const response = await fetch('/api/chat-history');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.chatHistories) {
        // Format the data to match our ChatSession interface
        const formattedChats = data.chatHistories.map((chat: any) => ({
          id: chat.chatId,
          title: chat.title || 'Untitled Chat',
          timestamp: chat.updatedAt || new Date().toISOString(),
          messages: chat.messages || []
        }));
        
        setPreviousChats(formattedChats);
        console.log("Formatted chat histories:", formattedChats);
      } else {
        console.log("No chat histories found or format unexpected:", data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Show toast error notification
      toast({
        title: "Failed to load chat history",
        description: "Please try again later or contact support if the issue persists.",
        variant: "destructive"
      });
      
      // Use mock data if API fails
      setPreviousChats([
        {
          id: '1',
          title: 'Liquidation Risk Analysis',
          timestamp: new Date(Date.now() - 7200000).toLocaleString(),
          messages: [
            { role: 'user', content: 'How can I reduce my liquidation risk?' },
            { role: 'assistant', content: 'You can reduce liquidation risk by adding more collateral, reducing your leverage, or setting up alerts to monitor price movements.' }
          ]
        },
        {
          id: '2',
          title: 'Market Analysis',
          timestamp: new Date(Date.now() - 86400000).toLocaleString(),
          messages: [
            { role: 'user', content: 'What are the current market trends?' },
            { role: 'assistant', content: 'The market is currently showing signs of recovery after recent volatility. Consider diversifying your portfolio to manage risk.' }
          ]
        }
      ]);
    } finally {
      setLoadingChats(false);
    }
  };

  // Fetch bot notifications
  const fetchBotNotifications = async () => {
    if (!session?.user?.email) return;
    
    try {
      setLoadingNotifications(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Filter to only bot notifications
        const botNotifications = data.filter(notification => 
          notification.source === 'bot'
        ).slice(0, 5); // Only show 5 most recent
        
        setNotifications(botNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Show toast error notification
      toast({
        title: "Failed to load notifications",
        description: "Unable to retrieve bot notifications. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Load chat by ID
  const loadChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setShowDropdown(false);
    
    // Update the URL without refreshing the page
    if (pathname !== `/chat/${chatId}`) {
      router.push(`/chat/${chatId}`, { scroll: false });
    }
    
    toast({
      title: "Chat Loaded",
      description: "Previous chat history has been loaded successfully."
    });
  };

  // Initialize
  useEffect(() => {
    if (session?.user?.email) {
      fetchBotNotifications();
      fetchChatHistory();
    }
  }, [session]);

  // Refresh notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.user?.email) {
        fetchBotNotifications();
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [session]);

  // Add back the missing useEffect
  useEffect(() => {
    // Handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Don't render anything while checking authentication
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const startNewChat = () => {
    setCurrentChatId(null);
    setShowDropdown(false);
    
    // Update URL to /chat for new chat
    if (pathname !== '/chat') {
      router.push('/chat', { scroll: false });
    }
    
    // Show toast notification for new chat
    toast({
      title: "New chat started",
      description: "Ask FlowPilot anything about trading, market analysis, or risk management."
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] relative">
      {/* Background glow effects */}
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 left-10 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
      
      <div className="flex h-full">
        {/* Main Chat Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
        >
          <div className="flex justify-between items-center mb-4">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold "
            >
              Chat with FlowPilot AI
            </motion.h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startNewChat}
                className="flex items-center gap-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </motion.button>
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                className="bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm transition-all duration-200"
              >
                {showSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </Button>
              <div className="relative" ref={dropdownRef}>
                <Button 
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    if (!showDropdown) fetchChatHistory();
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>History</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-white/5 backdrop-blur-lg rounded-lg shadow-lg p-2 z-10 border border-white/10"
                      style={{
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                        background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
                      }}
                    >
                      <div className="flex justify-between items-center p-2 border-b border-white/10 mb-2">
                        <h3 className="font-medium">Chat History</h3>
                        <Button 
                          onClick={() => fetchChatHistory()}
                          className="bg-white/5 hover:bg-white/10 border border-white/5 h-8 px-2 text-xs"
                        >
                          <ArchiveRestore className="w-3 h-3 mr-1" />
                          Refresh
                        </Button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {loadingChats ? (
                          <div className="flex justify-center p-4">
                            <div className="animate-spin h-5 w-5 border-2 border-white/50 rounded-full border-t-transparent"></div>
                          </div>
                        ) : previousChats.length > 0 ? (
                          previousChats.map((chat) => (
                            <motion.div 
                              key={chat.id} 
                              className={`p-2 hover:bg-white/10 rounded-md cursor-pointer transition-colors border ${
                                currentChatId === chat.id ? 'border-blue-500/30 bg-blue-500/10' : 'border-transparent hover:border-white/10'
                              }`}
                              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                              onClick={() => loadChat(chat.id)}
                            >
                              <div className="flex justify-between items-center">
                                <p className="font-medium truncate">{chat.title}</p>
                                <p className="text-xs text-white/50">{formatTimestamp(chat.timestamp)}</p>
                              </div>
                              <p className="text-xs text-white/70 truncate">
                                {chat.messages[0]?.content?.slice(0, 50) || 'No messages'}...
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-center text-white/50 p-4">No chat history yet</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Chat Component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full rounded-lg border border-white/5 overflow-hidden shadow-xl"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 20px -10px rgba(73, 98, 255, 0.3)",
              background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              backdropFilter: "blur(12px)"
            }}
          >
            <Chat chatId={currentChatId} />
          </motion.div>
        </motion.div>
        
        {/* Sidebar with Recent Bot Notifications */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-80 ml-4 pl-4 relative"
              style={{ 
                borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Search bar */}
              <div className="mb-6 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-semibold mb-4 flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                Recent Bot Activity
              </motion.h3>
              
              {loadingNotifications ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin h-5 w-5 border-2 border-white/50 rounded-full border-t-transparent"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div 
                      key={notification._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-3 rounded-lg border border-white/10 overflow-hidden relative group"
                      style={{
                        background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-white/70 mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          {notification.type}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button
                      onClick={() => window.location.href = '/alarms'}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 mt-2 transition-all duration-200"
                    >
                      View All Notifications
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center p-6 rounded-lg border border-white/5 bg-white/5"
                >
                  <p>No recent bot activity</p>
                  <p className="text-xs mt-2 text-white/50">Start chatting to see AI interactions</p>
                </motion.div>
              )}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold mb-4">Ask FlowPilot About</h3>
                <div className="space-y-3">
                  {[
                    "Market trends and price predictions",
                    "Risk management strategies", 
                    "Portfolio optimization",
                    "DeFi protocols and yield farming"
                  ].map((tip, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <p className="text-sm">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage; 