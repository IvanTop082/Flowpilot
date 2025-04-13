/**
 * StarkNet Wallet Debug File
 * 
 * This file contains utility functions for debugging StarkNet wallet connections.
 * Run this code directly in the browser console to diagnose wallet connection issues.
 */

// COPY AND PASTE THIS CODE INTO YOUR BROWSER CONSOLE

// Helper function to detect a Braavos wallet
function detectBraavosWallet(starknetObj) {
  if (!starknetObj) {
    console.log('❌ No StarkNet object available');
    return false;
  }

  console.log('🔍 Checking StarkNet object:', starknetObj);
  console.log('🔑 StarkNet object keys:', Object.keys(starknetObj));
  
  try {
    // Check for direct braavos property
    if (starknetObj.braavos) {
      console.log('✅ Detected Braavos via direct property');
      return true;
    }
    
    // Check for name that includes "braavos"
    if (starknetObj.name && typeof starknetObj.name === 'string' && 
        starknetObj.name.toLowerCase().includes('braavos')) {
      console.log('✅ Detected Braavos via name property:', starknetObj.name);
      return true;
    }
    
    // Check for id that includes "braavos"
    if (starknetObj.id && typeof starknetObj.id === 'string' && 
        starknetObj.id.toLowerCase().includes('braavos')) {
      console.log('✅ Detected Braavos via id property:', starknetObj.id);
      return true;
    }
    
    // Look for any property that might indicate Braavos
    const starknetKeys = Object.keys(starknetObj);
    for (const key of starknetKeys) {
      if (key.toLowerCase().includes('braavos')) {
        console.log(`✅ Detected Braavos via property: ${key}`);
        return true;
      }
    }
    
    console.log('❌ Braavos not detected via any method');
    return false;
  } catch (e) {
    console.error("❌ Error detecting Braavos:", e);
    return false;
  }
}

// Check for StarkNet in window
console.log('🔎 Checking for StarkNet...');
if (window.starknet) {
  console.log('✅ StarkNet found in window object');
  console.log('📝 StarkNet info:', {
    id: window.starknet.id || 'undefined',
    name: window.starknet.name || 'undefined',
    version: window.starknet.version || 'undefined'
  });
  
  // Check for Braavos
  const hasBraavos = detectBraavosWallet(window.starknet);
  console.log('🔷 Has Braavos wallet:', hasBraavos);
  
  // Check for Argent X
  const hasArgentX = !!window.starknet.argentX;
  console.log('🔹 Has Argent X wallet:', hasArgentX);
  
  // Try getting available methods
  console.log('📋 Available methods:', 
    Object.getOwnPropertyNames(window.starknet).filter(item => typeof window.starknet[item] === 'function')
  );
  
  // Check if window.starknet is directly a wallet provider
  if (typeof window.starknet.enable === 'function' && window.starknet.account) {
    console.log('🔑 StarkNet appears to be a direct wallet provider');
  }
  
  // Debugging specific wallet features
  try {
    if (window.starknet.braavos) {
      console.log('📊 Braavos details:', {
        account: !!window.starknet.braavos.account,
        enable: typeof window.starknet.braavos.enable === 'function',
        methods: Object.getOwnPropertyNames(window.starknet.braavos).filter(item => typeof window.starknet.braavos[item] === 'function')
      });
    }
    
    if (window.starknet.argentX) {
      console.log('📊 Argent X details:', {
        account: !!window.starknet.argentX.account,
        enable: typeof window.starknet.argentX.enable === 'function',
        methods: Object.getOwnPropertyNames(window.starknet.argentX).filter(item => typeof window.starknet.argentX[item] === 'function')
      });
    }
  } catch (e) {
    console.error('❌ Error inspecting wallet details:', e);
  }
} else {
  console.log('❌ StarkNet NOT found in window object');
  console.log('💡 Please install a StarkNet wallet like Braavos or Argent X');
}

console.log('✅ Wallet debug complete - Check your browser console for detailed information'); 