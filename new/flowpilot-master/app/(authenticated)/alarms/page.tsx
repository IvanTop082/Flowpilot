"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Check, RotateCw, CheckCheck, X, Info, Ban, MessageSquare, Filter } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// Define notification type
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  source: 'system' | 'bot' | 'market';
  read: boolean;
  relatedAsset?: string;
  createdAt: string;
}

const AlarmsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'alerts' | 'market' | 'bot'>('all');
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Session protection - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/account');
    }
  }, [status, router]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      setIsLoadingAction(true);
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [id] })
      });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setIsLoadingAction(true);
      await fetch('/api/notifications/read', {
        method: 'PUT'
      });
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Add test notification (for development)
  const addTestNotification = async (type: 'alert' | 'info' | 'warning' | 'success', source: 'system' | 'bot' | 'market') => {
    try {
      setIsLoadingAction(true);
      
      const titles = {
        'alert': 'Liquidation Risk Alert',
        'warning': 'Price Movement Warning',
        'info': 'Portfolio Update',
        'success': 'Trade Executed Successfully'
      };
      
      const messages = {
        'alert': 'Your ETH position is at risk of liquidation. Consider adding more collateral.',
        'warning': 'BTC price has dropped 5% in the last hour.',
        'info': 'Your portfolio value has been updated.',
        'success': 'Your limit order has been filled at the target price.'
      };
      
      const assets = {
        'alert': 'ETH',
        'warning': 'BTC',
        'info': '',
        'success': 'SOL'
      };
      
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titles[type],
          message: messages[type],
          type,
          source,
          relatedAsset: assets[type]
        })
      });
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error adding test notification:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'alerts') return notification.type === 'alert' || notification.type === 'warning';
    if (activeTab === 'market') return notification.source === 'market';
    if (activeTab === 'bot') return notification.source === 'bot';
    return true;
  });

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  // Initialize
  useEffect(() => {
    if (session?.user?.email) {
      fetchNotifications();
    }
  }, [session]);

  // Generate dummy notifications during development if there are none
  useEffect(() => {
    const createTestData = async () => {
      if (notifications.length === 0 && !loading && process.env.NODE_ENV === 'development') {
        await addTestNotification('alert', 'system');
        await addTestNotification('warning', 'market');
        await addTestNotification('info', 'bot');
        await addTestNotification('success', 'system');
      }
    };
    
    createTestData();
  }, [loading, notifications.length]);

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
            Notifications & Alerts
          </h1>
          <p className="text-white/70">Stay informed about your positions and market changes</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchNotifications}
            className="bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm transition-all duration-200"
            disabled={loading}
          >
            <RotateCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={markAllAsRead}
            className="bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm transition-all duration-200"
            disabled={isLoadingAction || notifications.every(n => n.read)}
          >
            <CheckCheck className="w-5 h-5 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 overflow-x-auto pb-2 p-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/5"
      >
        {[
          { id: 'all', label: 'All', icon: null },
          { 
            id: 'unread', 
            label: 'Unread', 
            icon: null, 
            badge: notifications.filter(n => !n.read).length 
          },
          { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
          { id: 'market', label: 'Market Updates', icon: null },
          { id: 'bot', label: 'Bot Messages', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
        ].map(tab => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/5 hover:bg-white/10 border border-white/5 transition-colors duration-200'
            } whitespace-nowrap`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="ml-2 bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                {tab.badge}
              </span>
            )}
          </Button>
        ))}
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <RotateCw className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-lg border border-white/5 text-center"
            style={{
              background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            <Ban className="w-12 h-12 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold">No notifications found</h3>
            <p className="text-white/70 mt-2">You don't have any {activeTab !== 'all' ? activeTab + ' ' : ''}notifications yet.</p>
            
            {/* Development helpers */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 space-y-2">
                <p className="text-sm text-white/50">Development options:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    onClick={() => addTestNotification('alert', 'system')}
                    size="sm"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20"
                  >
                    Add Alert
                  </Button>
                  <Button 
                    onClick={() => addTestNotification('warning', 'market')}
                    size="sm"
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/20"
                  >
                    Add Warning
                  </Button>
                  <Button 
                    onClick={() => addTestNotification('info', 'bot')}
                    size="sm" 
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20"
                  >
                    Add Bot Message
                  </Button>
                  <Button 
                    onClick={() => addTestNotification('success', 'system')}
                    size="sm"
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20"
                  >
                    Add Success
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-1 rounded-lg border border-white/5"
              style={{
                background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
              }}
            >
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg flex items-start gap-4 mb-2 last:mb-0 
                    ${notification.read 
                      ? 'bg-white/5 border border-white/5' 
                      : 'bg-white/10 border border-white/20'
                    } ${notification.type === 'alert' 
                      ? 'bg-gradient-to-r from-red-500/5 to-transparent border-red-500/20' 
                      : notification.type === 'warning'
                      ? 'bg-gradient-to-r from-yellow-500/5 to-transparent border-yellow-500/20'
                      : notification.type === 'success'
                      ? 'bg-gradient-to-r from-green-500/5 to-transparent border-green-500/20'
                      : 'bg-gradient-to-r from-blue-500/5 to-transparent border-blue-500/20'
                    }`}
                >
                  <div className="mt-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'alert' ? 'bg-red-500/20' :
                      notification.type === 'warning' ? 'bg-yellow-500/20' :
                      notification.type === 'success' ? 'bg-green-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">
                        {notification.title}
                        {notification.relatedAsset && (
                          <span className="ml-2 text-sm text-white/70">({notification.relatedAsset})</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification._id)}
                            className="h-7 p-0 px-2 hover:bg-white/10"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <span className="text-xs text-white/50">
                          {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/70 mt-1">{notification.message}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                        notification.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                        notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        notification.type === 'success' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {notification.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                        {notification.source}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Alarm Settings */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Notification Settings
          </h2>
          <Button className="bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter Preferences
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Liquidation Alerts",
              description: "Receive alerts when positions near liquidation",
              subtext: "Warns when collateral ratio falls below threshold",
              color: "red"
            },
            {
              title: "Price Alerts",
              description: "Get notified about significant price movements",
              subtext: "Customizable thresholds for your watched assets",
              color: "yellow"
            },
            {
              title: "Bot Activity",
              description: "Notifications from FlowPilot AI bot",
              subtext: "Strategy suggestions and market insights",
              color: "blue"
            },
            {
              title: "Notification Delivery",
              description: "Choose how to receive notifications",
              subtext: "Email, browser, or mobile push options",
              color: "green"
            }
          ].map((setting, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-5 rounded-lg border border-white/5 relative overflow-hidden group"
              style={{
                background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
              }}
            >
              {/* Background glow */}
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-30 -z-10
                ${setting.color === "red" ? "bg-red-500" : 
                 setting.color === "yellow" ? "bg-yellow-500" : 
                 setting.color === "green" ? "bg-green-500" : 
                 "bg-blue-500"}`} 
              />
              
              <h3 className="font-semibold">{setting.title}</h3>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-white/70">{setting.description}</p>
                  <p className="text-sm text-white/50">{setting.subtext}</p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200">
                  Configure
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlarmsPage; 