"use client";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import LiquidityDashboard from '@/components/LiquidityDashboard';
import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative">
      {/* Background glow effects */}
      <div className="fixed top-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -z-10" />
      <div className="fixed bottom-20 left-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[130px] -z-10" />
      <div className="fixed top-1/2 left-1/3 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
      
      <Header />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <Hero />
        <FeaturesSection />
        <LiquidityDashboard />
        <AIChat />
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Index;