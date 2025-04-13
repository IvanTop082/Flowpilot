"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export type WalletType = 'ethereum';

export type ConnectedWallet = {
  address: string;
  walletType: WalletType;
  name: string; // MetaMask
  chainId: number | null;
  isConnected: boolean;
  balance: string;
};

// Define the context type
export interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: number | null;
  switchNetwork: (targetChainId: number) => Promise<void>;
  error: string | null;
  signMessage: (message: string) => Promise<string>;
  saveMessageOnChain: (message: string) => Promise<string>;
  walletType: WalletType | null;
  walletName: string | null;
  wallets: ConnectedWallet[];
}

// Create the context with default values
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);

  // Connect wallet function (MetaMask only)
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        // Get chain ID
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);
        
        // Get balance
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        const balance = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
        
        setAddress(account);
        setIsConnected(true);
        setBalance(balance);
        setChainId(chainId);
        setWalletType('ethereum');
        setWalletName('MetaMask');
        
        // Add to wallets array if not already there
        setWallets(prev => {
          const exists = prev.some(w => w.address.toLowerCase() === account.toLowerCase() && w.walletType === 'ethereum');
          if (!exists) {
            return [...prev, {
              address: account,
              walletType: 'ethereum',
              name: 'MetaMask',
              chainId,
              isConnected: true,
              balance
            }];
          }
          return prev;
        });
        
        setError(null);
      } else {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
      return Promise.reject(error);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance('0');
    setChainId(null);
    setWalletType(null);
    setWalletName(null);
    setWallets([]);
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      if (!isConnected || !window.ethereum) {
        throw new Error('No wallet connected');
      }
      
      // Convert target chain ID to hexadecimal
      const targetChainIdHex = `0x${targetChainId.toString(16)}`;
      
      // Request network switch
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainIdHex }],
        });
      } catch (switchError: any) {
        // If the chain hasn't been added to MetaMask, we can't switch to it
        if (switchError.code === 4902) {
          // Chain not added, show an error
          throw new Error(`Chain with ID ${targetChainId} not available in your wallet`);
        }
        throw switchError;
      }
      
      // Update chain ID after successful switch
      setChainId(targetChainId);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error switching network:', error);
      setError(error instanceof Error ? error.message : 'Failed to switch network');
      return Promise.reject(error);
    }
  };

  // Sign message function
  const signMessage = async (message: string): Promise<string> => {
    try {
      if (!isConnected || !address) {
        throw new Error('No wallet connected');
      }
      
      if (window.ethereum) {
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address],
        });
        return signature;
      } else {
        // Fallback for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "0x" + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign message');
      return Promise.reject(error);
    }
  };

  // Save message on-chain function
  const saveMessageOnChain = async (message: string): Promise<string> => {
    try {
      if (!isConnected || !address) {
        throw new Error('No wallet connected');
      }
      
      // For demonstration, we'll just simulate a transaction
      console.log('Simulating saving message on Ethereum chain:', message);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    } catch (error) {
      console.error('Error saving message on chain:', error);
      setError(error instanceof Error ? error.message : 'Failed to save message on chain');
      return Promise.reject(error);
    }
  };

  // Set up event listeners for wallet changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.ethereum) {
        // Handle account changes
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnectWallet();
          } else if (accounts[0] !== address) {
            // Account changed, update state
            setAddress(accounts[0]);
          }
        };
        
        // Handle network changes - with proper typing
        const handleChainChanged = (chainIdHex: string) => {
          setChainId(parseInt(chainIdHex, 16));
        };
        
        // Set up event listeners with explicit typing
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        // @ts-ignore - The ethereum provider types are not properly defined
        window.ethereum.on('chainChanged', handleChainChanged);
        
        // Clean up event listeners
        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            // @ts-ignore - The ethereum provider types are not properly defined
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    }
  }, [address, disconnectWallet]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        balance,
        connectWallet,
        disconnectWallet,
        chainId,
        switchNetwork,
        error,
        signMessage,
        saveMessageOnChain,
        walletType,
        walletName,
        wallets
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 
