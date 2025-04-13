"use client";
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 px-4 border-t border-white/10">
      <div className="container-fluid max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="FlowPilot Logo" 
                width={150} 
                height={150} 
                className="w-[120px] sm:w-[150px]"
              />
            </div>
            <p className="text-sm sm:text-base text-white/70 mb-4 max-w-md">
              AI-driven liquidity management that automatically balances your assets 
              across pools, optimizing for yield while mitigating impermanent loss.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">AI Assistant</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Hackathon</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/10 text-center text-white/50 text-xs sm:text-sm">
          <p>© 2025 FlowPilot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
