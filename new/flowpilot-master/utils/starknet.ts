/**
 * StarkNet Utilities
 * Pure utility functions for StarkNet interactions - no React hooks
 */

/**
 * Detects if a StarkNet object contains Braavos wallet
 */
export const detectBraavosWallet = (starknetObj: any): boolean => {
  if (!starknetObj) return false;
  
  try {
    // Multiple detection methods
    // 1. Direct braavos property
    if (starknetObj.braavos) {
      console.log('Detected Braavos via direct property');
      return true;
    }
    
    // 2. Name includes "braavos"
    if (starknetObj.name && typeof starknetObj.name === 'string' && 
        starknetObj.name.toLowerCase().includes('braavos')) {
      console.log('Detected Braavos via name property');
      return true;
    }
    
    // 3. ID includes "braavos"
    if (starknetObj.id && typeof starknetObj.id === 'string' && 
        starknetObj.id.toLowerCase().includes('braavos')) {
      console.log('Detected Braavos via id property');
      return true;
    }
    
    // 4. Look for any property that might indicate Braavos
    const starknetKeys = Object.keys(starknetObj);
    for (const key of starknetKeys) {
      if (key.toLowerCase().includes('braavos')) {
        console.log(`Detected Braavos via property: ${key}`);
        return true;
      }
    }
    
    console.log('Braavos not detected via any method');
    return false;
  } catch (e) {
    console.error("Error detecting Braavos:", e);
    return false;
  }
};

/**
 * Gets the appropriate StarkNet account based on wallet name - pure function
 */
export const getStarknetAccount = (starknetObj: any, walletName: string): any => {
  if (!starknetObj) return null;
  
  // If Braavos
  if (walletName === 'Braavos') {
    // Try different ways to get Braavos account
    if (starknetObj.braavos && starknetObj.braavos.account) {
      return starknetObj.braavos.account;
    }
    
    // If it's identified as Braavos but doesn't have the braavos property,
    // the main starknet object might be the Braavos wallet itself
    if ((starknetObj.name && starknetObj.name.toLowerCase().includes('braavos')) ||
        (starknetObj.id && starknetObj.id.toLowerCase().includes('braavos'))) {
      return starknetObj.account;
    }
  }
  
  // If Argent X
  if (walletName === 'Argent X' && starknetObj.argentX) {
    return starknetObj.argentX.account;
  }
  
  // Default to the main account
  return starknetObj.account;
};

/**
 * Safely gets a copy of the window.starknet object to avoid any reactivity issues
 */
export const getStarknetObject = (): any => {
  if (typeof window === 'undefined' || !window.starknet) {
    return null;
  }
  
  try {
    // Create a stable reference to avoid reactivity issues
    return { ...window.starknet };
  } catch (e) {
    console.error("Error creating StarkNet object copy:", e);
    return null;
  }
}; 