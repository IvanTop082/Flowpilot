"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bell, Activity, AlertTriangle, TrendingDown, TrendingUp, Plus, BarChart3, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Session protection - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/account');
    }
  }, [status, router]);

  // Only fetch user progress if authenticated
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await fetch('/api/user-progress');
        const data = await response.json();
        if (data && !data.error) {
          setUserProgress(data);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserProgress();
    }
  }, [session]);

  // Don't render anything while checking authentication
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Background glow effects */}
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-20 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Liquidation Manager
          </h1>
          <p className="text-white/70">Monitor and manage your positions at risk of liquidation</p>
        </div>
        <Button
          onClick={() => router.push('/chat')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Get Help
        </Button>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "At Risk Positions",
            value: "3",
            description: "Positions near liquidation",
            icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
            color: "yellow"
          },
          {
            title: "Total Value at Risk",
            value: "$12,450",
            description: "Across all positions",
            icon: <TrendingDown className="w-6 h-6 text-red-400" />,
            color: "red"
          },
          {
            title: "Safe Positions",
            value: "7",
            description: "Well above liquidation",
            icon: <TrendingUp className="w-6 h-6 text-green-400" />,
            color: "green"
          },
          {
            title: "Risk Tolerance",
            value: userProgress?.riskTolerance || 'Not Set',
            description: "Your risk preference",
            icon: <Activity className="w-6 h-6 text-blue-400" />,
            color: "blue"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-lg border border-white/5 relative overflow-hidden"
            style={{
              background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            {/* Background accent */}
            <div 
              className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] -z-10 opacity-20
                ${item.color === "yellow" ? "bg-yellow-500" : 
                 item.color === "red" ? "bg-red-500" : 
                 item.color === "green" ? "bg-green-500" : 
                 "bg-blue-500"}`}
            />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.icon}
            </div>
            <p className={`text-3xl font-bold capitalize
              ${item.color === "yellow" ? "text-yellow-400" : 
               item.color === "red" ? "text-red-400" : 
               item.color === "green" ? "text-green-400" : 
               "text-blue-400"}`}>
              {item.value}
            </p>
            <p className="text-sm text-white/70 mt-2">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Positions at Risk */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-lg border border-white/5 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20" />
        
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
          Positions at Risk
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium flex items-center">
                  <Zap className="w-4 h-4 text-red-400 mr-1" />
                  ETH/USDT
                </p>
                <p className="text-sm text-white/70">Leverage: 5x</p>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-medium">-12.5%</p>
                <p className="text-sm text-white/70">$2,500 at risk</p>
              </div>
            </div>
            <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" style={{ width: "87.5%" }}></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium flex items-center">
                  <BarChart3 className="w-4 h-4 text-yellow-400 mr-1" />
                  BTC/USDT
                </p>
                <p className="text-sm text-white/70">Leverage: 3x</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-medium">-8.2%</p>
                <p className="text-sm text-white/70">$5,000 at risk</p>
              </div>
            </div>
            <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" style={{ width: "91.8%" }}></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Risk Management",
            actions: [
              { label: "Set Liquidation Alerts", icon: <AlertTriangle className="w-5 h-5" /> },
              { label: "Adjust Leverage", icon: <TrendingDown className="w-5 h-5" /> }
            ]
          },
          {
            title: "Position Actions",
            actions: [
              { label: "Add Margin", icon: <Plus className="w-5 h-5" /> },
              { label: "Reduce Position", icon: <TrendingDown className="w-5 h-5" /> }
            ]
          },
          {
            title: "Support",
            actions: [
              { label: "Chat with FlowPilot", icon: <MessageSquare className="w-5 h-5" />, onClick: () => router.push('/chat') },
              { label: "Set Custom Alerts", icon: <Bell className="w-5 h-5" /> }
            ]
          }
        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="p-6 rounded-lg border border-white/5"
            style={{
              background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <div className="space-y-3">
              {section.actions.map((action, actionIndex) => (
                <Button 
                  key={actionIndex}
                  onClick={action.onClick}
                  className="w-full justify-start gap-2 bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 