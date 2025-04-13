"use client"
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const SignupPage = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen bg-flow-blue flex items-center justify-center">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-flow-teal/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-flow-purple/10 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism rounded-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-flow bg-flow-size animate-flow rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">FP</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to FlowPilot</h1>
          <p className="text-white/70">Sign in to start managing your DeFi portfolio</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-white/90 text-gray-900 py-6 text-lg flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </Button>

          <p className="text-center text-white/70 text-sm">
            By continuing, you agree to FlowPilot's{' '}
            <a href="#" className="text-flow-purple hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-flow-purple hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage; 