interface StarknetWindowObject {
  enable: () => Promise<any>;
  account: StarknetAccount;
  isConnected: boolean;
  id: string;
  name: string;
  version: string;
  icon: string;
  provider: any;
  isPreauthorized: () => Promise<boolean>;
  request: (request: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  // Wallet-specific properties
  braavos?: StarknetWindowObject;
  argentX?: StarknetWindowObject;
}

interface StarknetAccount {
  address: string;
  chainId: string;
  signMessage: (typedData: any) => Promise<any>;
}

interface Window {
  ethereum?: any;
  starknet?: StarknetWindowObject;
} 