"use client"
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "blue" 
}: FeatureCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "green": return { bg: "bg-green-500/20", text: "text-green-400" };
      case "yellow": return { bg: "bg-yellow-500/20", text: "text-yellow-400" };
      case "red": return { bg: "bg-red-500/20", text: "text-red-400" };
      case "purple": return { bg: "bg-purple-500/20", text: "text-purple-400" };
      default: return { bg: "bg-blue-500/20", text: "text-blue-400" };
    }
  };
  
  const { bg, text } = getColorClasses();
  
  return (
    <motion.div 
      className="p-4 sm:p-6 rounded-lg border border-white/5 relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        borderColor: "rgba(255,255,255,0.1)"
      }}
      transition={{ duration: 0.3 }}
    > 
      <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 rounded-full blur-[30px] -z-10 opacity-20" 
        style={{ background: `var(--${color === "blue" ? "blue" : color === "green" ? "green" : color === "yellow" ? "yellow" : color === "red" ? "red" : "purple"}-500)` }}
      />
      
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${bg}`}>
        <Icon className={text} size={20} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-white/70">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
