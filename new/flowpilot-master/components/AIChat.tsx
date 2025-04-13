"use client";
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, ChevronRight, Plus, Bot, User, Bot as BotIcon, Loader2, ShieldCheck, BarChart, LucideIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

interface SuggestionProps {
  text: string;
  icon: LucideIcon;
  onClick: () => void;
}

const Suggestion = ({ text, icon: Icon, onClick }: SuggestionProps) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all relative overflow-hidden group"
    whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(59, 130, 246, 0.15)" }}
    whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(59, 130, 246, 0)" }}
  >
    <div className="absolute inset-0 w-[200%] animate-[shine_8s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
      <Icon size={14} className="text-blue-400" />
    </div>
    <span className="relative z-10">{text}</span>
  </motion.button>
);

const AIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm FlowPilot AI. How can I help optimize your liquidity today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let responseText = '';
      
      if (input.toLowerCase().includes('rebalance')) {
        responseText = "I'll analyze your positions to optimize for yield while minimizing impermanent loss. Based on current market conditions, I recommend shifting 30% of your ETH/USDC position to wBTC/ETH to reduce IL exposure. This could increase your overall APR by ~0.8%. Would you like me to execute this rebalancing?";
      } else if (input.toLowerCase().includes('yield') || input.toLowerCase().includes('apr')) {
        responseText = "Your current portfolio has an average APR of 3.8%. I've identified opportunities to increase this to 4.5% by adjusting allocations. The highest yielding pool currently available to you is wBTC/ETH at 5.1% APR with a medium IL risk profile.";
      } else if (input.toLowerCase().includes('risk') || input.toLowerCase().includes('impermanent loss')) {
        responseText = "Your portfolio currently has a medium impermanent loss risk profile. The highest risk is in your wBTC/ETH position due to price volatility between the assets. I estimate you've saved approximately $842 in the last 30 days through our automated rebalancing.";
      } else {
        responseText = "I can help you optimize your liquidity positions across multiple protocols. Would you like me to analyze your current portfolio for yield optimization, impermanent loss protection, or perform a complete rebalancing?";
      }
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    { text: "Rebalance my liquidity for maximum yield", icon: Zap },
    { text: "What's my current impermanent loss risk?", icon: ShieldCheck },
    { text: "Show me the highest yielding pools", icon: BarChart },
    { text: "Optimize for stable returns", icon: ChevronRight }
  ];

  return (
    <section id="ai" className="py-20 px-4 relative">
      {/* Background glow effects */}
      <div className="fixed top-20 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
      <div className="fixed bottom-20 left-20 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[130px] -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chat with 
            <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">FlowPilot AI</span>
          </motion.h2>
          <motion.p 
            className="text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Interact naturally with our advanced AI to manage your liquidity positions. 
            No complex interfaces—just tell the AI what you want to accomplish.
          </motion.p>
        </div>
        
        <motion.div 
          className="rounded-xl border border-white/10 relative overflow-hidden"
          style={{
            background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          
          <div className="flex flex-col h-[650px]">
            <div className="p-4 border-b border-white/10 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="font-medium">FlowPilot AI Assistant</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto flex items-center gap-1 py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all"
                onClick={() => setMessages([{
                  id: 1,
                  text: "Hello! I'm FlowPilot AI. How can I help optimize your liquidity today?",
                  sender: 'ai',
                  timestamp: new Date()
                }])}
              >
                <Plus size={14} />
                New Chat
              </motion.button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <AnimatePresence mode="wait">
                {messages.map((message) => (
                  <motion.div 
                    key={`message-${message.id}`} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 relative overflow-hidden ${
                        message.sender === 'user' 
                          ? 'bg-indigo-500/20 border border-indigo-500/30' 
                          : 'bg-white/5 border border-white/10'
                      }`}
                      style={{ backdropFilter: "blur(10px)" }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-indigo-500/20' 
                            : 'bg-blue-500/20'
                        }`}>
                          {message.sender === 'user' ? (
                            <User size={14} className="text-indigo-400" />
                          ) : (
                            <BotIcon size={14} className="text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 leading-relaxed">{message.text}</p>
                          <div className="text-white/40 text-xs mt-2 flex justify-end">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    key="typing-indicator"
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-[80%] rounded-lg p-4 bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <BotIcon size={14} className="text-blue-400" />
                        </div>
                        <div className="flex items-center space-x-2 py-2">
                          <div className="flex space-x-1.5">
                            <motion.div 
                              key="dot-1"
                              className="w-2 h-2 rounded-full bg-white/50"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                            />
                            <motion.div 
                              key="dot-2"
                              className="w-2 h-2 rounded-full bg-white/50"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                            />
                            <motion.div 
                              key="dot-3"
                              className="w-2 h-2 rounded-full bg-white/50"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                            />
                          </div>
                          <span className="text-white/50 text-sm">FlowPilot is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((suggestion, index) => (
                  <Suggestion
                    key={index}
                    text={suggestion.text}
                    icon={suggestion.icon}
                    onClick={() => setInput(suggestion.text)}
                  />
                ))}
              </div>
              
              <div className="flex items-center space-x-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask FlowPilot AI about your liquidity..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-white/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-3 rounded-lg relative overflow-hidden group"
                  onClick={handleSendMessage}
                  disabled={input.trim() === ''}
                >
                  <div className="absolute inset-0 w-[200%] animate-[shine_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                  <Send size={18} className="text-white relative z-10" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIChat;
