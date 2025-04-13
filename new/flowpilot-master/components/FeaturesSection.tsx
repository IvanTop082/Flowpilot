"use client"
import { Bot, BrainCircuit, LineChart, Shield, Zap, DollarSign } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Management',
      description: 'Advanced AI analyzes market conditions to automatically rebalance your liquidity positions for optimal returns.',
      color: 'blue' as const
    },
    {
      icon: BrainCircuit,
      title: 'Natural Language Interface',
      description: 'Interact with your portfolio through simple conversational prompts - no complex UI to navigate.',
      color: 'purple' as const
    },
    {
      icon: LineChart,
      title: 'Yield Optimization',
      description: 'Continuously monitors and shifts assets to the highest yielding pools while respecting your risk tolerance.',
      color: 'green' as const
    },
    {
      icon: Shield,
      title: 'Impermanent Loss Protection',
      description: 'Automatically mitigates impermanent loss by predicting price movements and adjusting positions accordingly.',
      color: 'yellow' as const
    },
    {
      icon: Zap,
      title: 'Real-time Rebalancing',
      description: 'Executes portfolio adjustments in real-time as market conditions change to maintain optimal positioning.',
      color: 'red' as const
    },
    {
      icon: DollarSign,
      title: 'Multi-protocol Support',
      description: 'Works across all major DeFi protocols including Uniswap, Curve, Balancer, and Sushiswap.',
      color: 'blue' as const
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 relative responsive-padding">
      <motion.div 
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Key <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Features</span>
        </h2>
        <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
          FlowPilot brings cutting-edge AI technology to DeFi liquidity management, making 
          yield optimization accessible through natural language.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            icon={feature.icon} 
            title={feature.title}
            description={feature.description}
            color={feature.color}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection; 