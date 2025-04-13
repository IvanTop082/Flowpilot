"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Copy, ExternalLink, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

// Wallet configuration
const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    type: 'ethereum' as const,
    icon: '🦊',
    description: 'Connect to your MetaMask wallet',
  }
];

const WalletPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { 
    isConnected, 
    address, 
    walletType,
    walletName: contextWalletName,
    connectWallet, 
    disconnectWallet, 
    wallets: connectedWallets
  } = useWallet();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletAvailability, setWalletAvailability] = useState<Record<string, boolean>>({});
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Check which wallets are available in browser
  useEffect(() => {
    // Define this function inside the useEffect to ensure it has access to the right context
    // but doesn't accidentally reach outside its scope
    const checkWalletAvailability = () => {
      const availability: Record<string, boolean> = {};
      
      // Check Ethereum wallets
      if (typeof window !== 'undefined') {
        // Safely check MetaMask
        try {
          // @ts-ignore - ethereum providers may have different properties
          availability['metamask'] = !!window.ethereum && (window.ethereum.isMetaMask === true);
        } catch (e) {
          availability['metamask'] = false;
        }
      } else {
        console.log('Window object not available');
        // Not in browser environment
        availability['metamask'] = false;
      }
      
      console.log('Wallet availability results:', availability);
      setWalletAvailability(availability);
    };
    
    // Call the function immediately
    checkWalletAvailability();
    
    // Recheck on window focus in case user installs extensions
    const handleFocus = () => checkWalletAvailability();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Session protection - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/account');
    }
  }, [status, router]);

  const handleConnectWallet = async () => {
    setConnectionError(null);
    setIsConnecting(true);
    setConnectingWalletId('metamask');
    setStatusMessage(null);
    
    try {
      await connectWallet();
      
      // Show success message without using toast
      setStatusMessage("Wallet connected successfully");
      
      // Set the wallet address for UI display
      setWalletAddress(address);
      setWalletName("MetaMask");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      // Set error message
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      setConnectionError(errorMessage);
    } finally {
      setIsConnecting(false);
      setConnectingWalletId(null);
    }
  };

  const handleDisconnectWallet = async () => {
    setIsDisconnecting(true);
    disconnectWallet();
    setIsDisconnecting(false);
    setWalletAddress(null);
    setStatusMessage("Wallet disconnected");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletIcon = (walletId: string) => {
    return wallets.find(w => w.id === walletId)?.icon || '💰';
  };

  // Loading state when session is loading
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-4 hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Wallet Management</h1>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-white">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Connected wallet */}
            {isConnected && address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">{getWalletIcon(contextWalletName?.toLowerCase() || 'metamask')}</span>
                  Connected Wallet: {contextWalletName || 'MetaMask'}
                </h2>
                
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40">
                    <div className="flex items-center space-x-3">
                      <div className="text-white/70">Address:</div>
                      <div className="font-mono">{truncateAddress(address)}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(address)}
                      className="hover:bg-white/5"
                    >
                      {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleDisconnectWallet}
                      variant="destructive"
                      className="bg-red-900 hover:bg-red-800 text-white" 
                      disabled={isDisconnecting}
                    >
                      {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Available wallets section */}
            {!isConnected && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
                <p className="text-white/70 text-sm mb-6">
                  Connect your MetaMask wallet to access advanced features and personalized insights.
                </p>
                
                {/* Display connection error if any */}
                {connectionError && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-white/80">
                    <p className="font-medium text-white mb-1">Connection Error:</p>
                    <p>{connectionError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {wallets.map((wallet) => {
                    const isAvailable = walletAvailability[wallet.id] !== false; // Consider true if undefined
                    const isCurrentlyConnecting = connectingWalletId === wallet.id && isConnecting;
                    
                    return (
                      <motion.button
                        key={wallet.id}
                        whileHover={{ y: -2, boxShadow: "0 5px 20px rgba(0,0,0,0.2)" }}
                        whileTap={{ y: 0 }}
                        disabled={!isAvailable || isConnecting}
                        onClick={() => handleConnectWallet()}
                        className={`w-full p-4 rounded-xl flex items-center justify-between
                          ${isAvailable ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800/50 cursor-not-allowed'}
                          border border-gray-700 transition-all`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{wallet.icon}</div>
                          <div>
                            <p className="font-medium">{wallet.name}</p>
                            <p className="text-xs text-white/60">{wallet.description}</p>
                          </div>
                        </div>
                        
                        <div>
                          {isCurrentlyConnecting ? (
                            <div className="h-5 w-5 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
                          ) : (
                            <ChevronRight className={`h-5 w-5 ${isAvailable ? 'text-white/60' : 'text-white/20'}`} />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {!walletAvailability['metamask'] && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="font-medium mb-2">MetaMask not detected</p>
                    <p className="text-sm text-white/80 mb-3">
                      To use this feature, you'll need to install the MetaMask extension.
                    </p>
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <span>Install MetaMask</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <h3 className="text-lg font-medium mb-3">Why Connect Your Wallet?</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start space-x-2">
                  <div className="mt-1 min-w-4 text-green-400">✓</div>
                  <p>Get personalized insights based on your assets</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="mt-1 min-w-4 text-green-400">✓</div>
                  <p>Verify messages with your wallet signature</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="mt-1 min-w-4 text-green-400">✓</div>
                  <p>Access advanced portfolio analytics</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="mt-1 min-w-4 text-green-400">✓</div>
                  <p>Save your messages on-chain for verification</p>
                </li>
              </ul>
              
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20 text-xs">
                <p className="text-white/90">
                  Your wallet is only used for verification and on-chain interactions initiated by you. We never have access to your private keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage; 