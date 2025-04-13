"use client";
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, BarChart3, Shield, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Hero = () => {
  const { data: session } = useSession();

  return (
    <section className="py-12 sm:py-16 pt-20 sm:pt-24 relative overflow-hidden responsive-padding">
      <motion.div 
        className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="inline-block px-4 py-2 mb-4 sm:mb-6 rounded-full bg-white/5 border border-white/10 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: ["0 0 0 rgba(59, 130, 246, 0)", "0 0 8px rgba(59, 130, 246, 0.3)", "0 0 0 rgba(59, 130, 246, 0)"]
            }}
            transition={{
              boxShadow: {
                repeat: Infinity,
                duration: 2
              }
            }}
          >
            <span className="text-blue-400 font-medium">FlowPilot</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">AI-Powered</span> Liquidity Management
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto md:mx-0">
            FlowPilot automatically balances your liquidity across pools, 
            optimizing yield and mitigating impermanent loss through 
            intelligent AI algorithms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href={session ? "/dashboard" : "/account"} className="w-full sm:w-auto">
              <motion.div
                className="relative overflow-hidden rounded-lg sm:ml-4 w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 w-[200%] animate-shine opacity-0 hover:opacity-100" />
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-purple-600 transition-all duration-500 shadow-lg px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg relative z-10 w-full sm:w-auto">
                  {session ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </motion.div>
            </Link>
            <Link href="/account" className="w-full sm:w-auto">
              <motion.div
                className="relative overflow-hidden rounded-lg w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 w-[200%] animate-shine opacity-0 hover:opacity-100" />
                <Button 
                  variant="outline" 
                  className="border-white/10 bg-white/5 hover:bg-white/20 hover:border-white/30 text-white px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-lg transition-all duration-500 relative z-10 w-full sm:w-auto"
                >
                  <MessageSquare className="mr-2" size={18} />
                  Try AI Chat
                </Button>
              </motion.div>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6 mt-8 sm:mt-12">
            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-sm sm:text-base"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
              }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="text-blue-400" size={16} />
              <span>AI-Driven</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-sm sm:text-base"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 0 15px rgba(74, 222, 128, 0.5)"
              }}
              transition={{ duration: 0.2 }}
            >
              <BarChart3 className="text-green-400" size={16} />
              <span>Yield Optimizer</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-sm sm:text-base"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 0 15px rgba(250, 204, 21, 0.5)"
              }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="text-yellow-400" size={16} />
              <span>IL Protection</span>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 w-full mt-8 md:mt-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div 
            className="p-4 sm:p-6 rounded-lg border border-white/5 relative overflow-hidden"
            style={{
              background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
            whileHover={{
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
              borderColor: "rgba(255,255,255,0.2)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-white/60 font-mono">FlowPilot AI</div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <motion.div 
                className="p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.2)"
                }}
              >
                <p className="text-white/80 text-xs sm:text-sm">
                  "Rebalance my liquidity for optimal yield while minimizing risk"
                </p>
              </motion.div>
              <motion.div 
                className="p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  borderColor: "rgba(59, 130, 246, 0.3)"
                }}
              >
                <p className="text-white/90 text-xs sm:text-sm font-mono">
                  Analyzing 8 pools across 3 protocols...
                </p>
                <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ 
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
              </motion.div>
              <motion.div 
                className="p-2 sm:p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(74, 222, 128, 0.15)",
                  borderColor: "rgba(74, 222, 128, 0.3)"
                }}
              >
                <p className="text-white/90 text-xs sm:text-sm font-mono">
                  Recommendation: Shift 30% from USDC/ETH to wBTC/ETH to reduce impermanent loss exposure by 18% while maintaining yield.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;