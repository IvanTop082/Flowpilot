"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';

interface WalletConnectionProps {
  onConnect: () => void;
}

const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  const { connectWallet, error, isConnected } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      await connectWallet();
      onConnect();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setConnectionError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center responsive-padding"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-flow bg-flow-size animate-flow rounded-full flex items-center justify-center">
        <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </div>
      
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Connect Your Wallet</h2>
      <p className="text-sm sm:text-base text-white/70 mb-6 sm:mb-8 max-w-md mx-auto px-4">
        To use FlowPilot's AI features, please connect your MetaMask wallet. This allows us to analyze your portfolio and provide personalized recommendations.
      </p>

      {(error || connectionError) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 flex items-center justify-center gap-2 mx-4 sm:mx-auto sm:max-w-md text-sm sm:text-base"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          {error || connectionError}
        </motion.div>
      )}

      <Button
        onClick={handleConnect}
        disabled={isConnecting || isConnected}
        className="bg-gradient-flow bg-flow-size animate-flow text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
      >
        {isConnecting ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Connecting...
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            Connect MetaMask
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </Button>

      <p className="text-xs sm:text-sm text-white/50 mt-4">
        Make sure you have MetaMask browser extension installed
      </p>
    </motion.div>
  );
};

export default WalletConnection; 