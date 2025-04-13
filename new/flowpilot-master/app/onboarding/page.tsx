"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Check, ArrowRight, Bell, Sliders, Target, Shield, LucideIcon, ArrowLeft, User, Activity, Network, Zap, MessageSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Step {
  id: number;
  title: string;
  description: string;
  action: () => void;
  buttonText: string;
  completed: boolean;
  icon: LucideIcon;
  content?: React.ReactNode;
}

const OnboardingPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [notifications, setNotifications] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState<string>("moderate");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check session and redirect if needed
  useEffect(() => {
    if (status === "authenticated") {
      // Check if user has completed onboarding before
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
      
      if (hasCompletedOnboarding === 'true') {
        setIsRedirecting(true);
        router.push('/dashboard');
      }
    } else if (status === "unauthenticated") {
      router.push('/account');
    }
  }, [status, router]);

  // If still loading session or redirecting, show loading state
  if (status === "loading" || status === "unauthenticated" || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // On last step - complete onboarding
      finishOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDisconnectWallet = () => {
    // Add your wallet disconnect logic here
  };

  const finishOnboarding = () => {
    console.log("Onboarding complete!");
    router.push("/dashboard");
  };

  const steps: Step[] = [
    {
      id: 1,
      title: 'Set Up Your Profile',
      description: `Welcome, ${session?.user?.email}! Let's customize your FlowPilot experience by setting up your profile preferences and notification settings.`,
      action: () => {},
      buttonText: 'Continue',
      completed: false,
      icon: Sliders,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              className="p-6 rounded-lg border border-white/10 relative overflow-hidden"
              style={{
                background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(10px)"
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 8px 30px rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(255,255,255,0.2)"
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] -z-10 opacity-20 bg-blue-500" />
            
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-white/70">Receive alerts about your portfolio and market movements</p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-lg border border-white/10 relative overflow-hidden"
              style={{
                background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(10px)"
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 8px 30px rgba(124, 58, 237, 0.2)",
                borderColor: "rgba(255,255,255,0.2)"
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] -z-10 opacity-20 bg-purple-500" />
              
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Profile Settings</span>
              </div>
              <p className="text-sm text-white/70">Customize your profile and preferences</p>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Configure Risk Tolerance',
      description: 'Help us understand your investment preferences to provide better recommendations.',
      action: () => {},
      buttonText: 'Continue',
      completed: false,
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { level: 'low', label: 'Conservative', icon: Shield, color: 'green' },
              { level: 'medium', label: 'Balanced', icon: Activity, color: 'blue' }, 
              { level: 'high', label: 'Aggressive', icon: Zap, color: 'red' }
            ].map(({ level, label, icon: Icon, color }) => (
              <motion.button
                key={level}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 8px 30px rgba(${color === 'green' ? '74, 222, 128' : color === 'blue' ? '59, 130, 246' : '239, 68, 68'}, 0.2)`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRiskTolerance(level)}
                className={`p-6 rounded-lg border text-center transition-all ${
                  riskTolerance === level
                    ? `border-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'red'}-500/30 bg-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'red'}-500/20`
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                style={{
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full bg-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'red'}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'red'}-400`} />
                  </div>
                  <span className="capitalize font-medium">{level}</span>
                  <span className="text-sm text-white/70">{label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Select Networks',
      description: 'Choose which blockchain networks you want to monitor and receive alerts for.',
      action: () => {},
      buttonText: 'Continue',
      completed: false,
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Ethereum', color: 'blue' },
              { name: 'Polygon', color: 'purple' },
              { name: 'Arbitrum', color: 'blue' },
              { name: 'Optimism', color: 'red' }
            ].map(({ name, color }) => (
              <motion.button
                key={name}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 8px 30px rgba(${color === 'blue' ? '59, 130, 246' : color === 'purple' ? '124, 58, 237' : '239, 68, 68'}, 0.2)`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedNetworks(prev => 
                    prev.includes(name)
                      ? prev.filter(c => c !== name)
                      : [...prev, name]
                  );
                }}
                className={`p-6 rounded-lg border text-center transition-all ${
                  selectedNetworks.includes(name)
                    ? `border-${color}-500/30 bg-${color}-500/20`
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                style={{
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                    <Network className={`w-6 h-6 text-${color}-400`} />
                  </div>
                  <span className="font-medium">{name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Ready to Go!',
      description: "You're all set to start using FlowPilot! Click 'Finish' to explore your dashboard.",
      action: () => {},
      buttonText: 'Finish',
      completed: false,
      icon: Check,
      content: (
        <motion.div 
          className="p-6 rounded-lg border border-white/10 relative overflow-hidden text-center"
          style={{
            background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            backdropFilter: "blur(10px)"
          }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(59, 130, 246, 0.2)", "0 0 40px rgba(59, 130, 246, 0.4)", "0 0 20px rgba(59, 130, 246, 0.2)"]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] opacity-50" />
          
          <motion.div 
            className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Check className="w-10 h-10 text-green-400" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-4">Congratulations!</h3>
          <p className="text-white/70 mb-6">
            Your FlowPilot account is now ready. You can start managing your liquidity, setting up alerts, and optimizing your DeFi portfolio.
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-white/70">Risk Monitoring</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white/70">Portfolio Tracking</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-white/70">AI Assistant</p>
            </div>
          </div>
        </motion.div>
      ),
    },
  ];

  const CurrentStep = steps[currentStep];
  const CurrentStepIcon = CurrentStep.icon;

  return (
    <div className="min-h-screen w-full py-12 flex flex-col justify-center items-center bg-gradient-to-br from-background via-black/80 to-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20" />
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Animated glow elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-flow-purple/20 rounded-full blur-3xl opacity-20 animate-pulse-gentle" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-flow-teal/20 rounded-full blur-3xl opacity-20 animate-pulse-gentle" style={{ animationDelay: '1s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto relative z-10"
      >
        <div className="glassmorphism border-[#7C3AED]/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="mr-4 p-3 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#0D9488] text-white">
              <CurrentStepIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {CurrentStep.title}
                <span className="text-sm font-normal gradient-text">Step {currentStep + 1} of {steps.length}</span>
              </h1>
              <p className="text-gray-400 mt-1">{CurrentStep.description}</p>
            </div>
          </div>
          
          <div className="relative mt-4">
            <div className="w-full bg-gray-800/50 h-1 rounded-full">
              <div
                className="h-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#0D9488]"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="py-6"
            >
              {CurrentStep.content}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={cn(
                "glassmorphism border-white/10 hover:bg-white/5 transition-all",
                currentStep === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className={cn(
                "flex-1 ml-4 btn-gradient",
                currentStep === steps.length - 1 && "bg-green-600 hover:bg-green-700"
              )}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Launch Dashboard
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage; 