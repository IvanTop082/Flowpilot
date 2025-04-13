"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glassmorphism py-2' : 'bg-transparent py-4'}`}>
      <div className="container-fluid flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-flow bg-flow-size animate-flow rounded-full"></div>
          <Image 
            src="/logo.png" 
            alt="logo" 
            width={150} 
            height={150} 
            className="w-[120px] md:w-[150px]"
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#dashboard" className="text-white/80 hover:text-white transition-colors">Demo</a>
          <a href="#ai" className="text-white/80 hover:text-white transition-colors">AI Chat</a>
          <Link href="/account" className="text-white/80 hover:text-white transition-colors">
            {session ? "Account" : "Login"}
          </Link>
          <Link href={session ? "/dashboard" : "/account"}>
            <Button className="bg-gradient-flow bg-flow-size animate-flow text-white">
              {session ? "Dashboard" : "Launch App"}
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation - Slide down animation */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 glassmorphism transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col py-4 px-6">
          <a 
            href="#features" 
            className="text-white/80 hover:text-white transition-colors py-3 border-b border-white/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#dashboard" 
            className="text-white/80 hover:text-white transition-colors py-3 border-b border-white/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Demo
          </a>
          <a 
            href="#ai" 
            className="text-white/80 hover:text-white transition-colors py-3 border-b border-white/10"
            onClick={() => setIsMenuOpen(false)}
          >
            AI Chat
          </a>
          <Link 
            href="/account" 
            className="text-white/80 hover:text-white transition-colors py-3 border-b border-white/10"
            onClick={() => setIsMenuOpen(false)}
          >
            {session ? "Account" : "Login"}
          </Link>
          <div className="pt-4">
            <Link 
              href={session ? "/dashboard" : "/account"} 
              onClick={() => setIsMenuOpen(false)}
              className="block w-full"
            >
              <Button className="bg-gradient-flow bg-flow-size animate-flow text-white w-full py-6">
                {session ? "Dashboard" : "Launch App"}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;