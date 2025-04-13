"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, MessageSquare, Settings, LogOut, ChevronLeft, Bell, Menu, Wallet } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, path, isActive, isCollapsed, onClick }: NavItemProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full rounded-lg flex items-center px-3 py-2.5 transition-all relative overflow-hidden group
        ${isActive 
        ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' 
        : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'}`}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`
        ${isActive ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'} 
        ${isCollapsed ? 'mx-auto' : 'mr-3'}
      `}>
        {icon}
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md"
          layoutId={`activeIndicator-${path}`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      {isActive && (
        <motion.div 
          className="absolute inset-0 bg-white/10 rounded-lg -z-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            transition: { 
              repeat: Infinity, 
              duration: 2,
            }
          }}
        />
      )}
    </motion.button>
  );
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Move the redirect to useEffect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Chat', path: '/chat' },
    { icon: <Bell className="h-5 w-5" />, label: 'Alarms', path: '/alarms' },
    { icon: <div className="h-5 w-5 flex items-center justify-center">👛</div>, label: 'Wallet', path: '/wallet' }
  ];

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    collapsed: {
      width: "5rem",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  // Logo animation variant
  const logoVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: {
        duration: 0.2,
        delay: 0.1
      }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transitionEnd: {
        display: "none"
      },
      transition: {
        duration: 0.1
      }
    }
  };

  // User profile animation variant
  const profileVariants = {
    expanded: {
      opacity: 1,
      height: "auto",
      display: "block",
      transition: {
        duration: 0.2
      }
    },
    collapsed: {
      opacity: 0,
      height: 0,
      transitionEnd: {
        display: "none"
      },
      transition: {
        duration: 0.1
      }
    }
  };

  // Only render content when session is loaded
  if (!session) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Sidebar */}
      <motion.div 
        className="bg-black/30 backdrop-blur-lg border-r border-white/5 h-full flex flex-col relative z-10"
        initial="expanded"
        animate={sidebarOpen ? "collapsed" : "expanded"}
        variants={sidebarVariants}
      >
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between h-16">
          <motion.h1 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600"
            variants={logoVariants}
          >
            FlowPilot
          </motion.h1>
          
          <motion.button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            whileHover={{ scale: 1.1, rotate: sidebarOpen ? -180 : 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 180 : 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
            >
              <ChevronLeft className="h-4 w-4 text-white/80" />
            </motion.div>
          </motion.button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 py-8 px-3">
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={`nav-${item.path}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={pathname === item.path}
                  isCollapsed={sidebarOpen}
                  onClick={() => router.push(item.path)}
                />
              </motion.div>
            ))}
          </nav>
        </div>
        
        {/* User profile & logout */}
        <div className="p-4 border-t border-white/10">
          <motion.div 
            className="mb-4 overflow-hidden"
            variants={profileVariants}
          >
            <p className="text-sm font-medium truncate">{session?.user?.email || 'User'}</p>
          </motion.div>
          
          <motion.button
            onClick={() => signOut()}
            className="w-full rounded-lg flex items-center px-3 py-2.5 bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`text-red-400 ${sidebarOpen ? 'mx-auto' : 'mr-3'}`}>
              <LogOut className="h-5 w-5" />
            </div>
            
            <AnimatePresence mode="wait">
              {!sidebarOpen && (
                <motion.span
                  key="logout-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Page content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
} 