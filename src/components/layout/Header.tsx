"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/lib/theme-context';

// Enhanced variants with spring animations
const headerVariants: Variants = {
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      opacity: { duration: 0.3 }
    } 
  },
  hidden: { 
    y: "-120%", 
    opacity: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94],
      opacity: { duration: 0.2 }
    } 
  },
};

// Animated hamburger icon component
const AnimatedHamburger = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  const { theme } = useTheme();
  
  return (
    <button 
      onClick={onClick}
      className={`relative bg-transparent transition-all duration-300 rounded-lg w-10 h-10 flex items-center justify-center p-0 group ${
        theme === 'dark' 
          ? 'text-slate-300 hover:text-orange-400' 
          : 'text-slate-600 hover:text-orange-500'
      }`}
      aria-label="Toggle Menu"
    >
      {/* Simple background on hover */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
        theme === 'dark'
          ? 'group-hover:bg-white/5'
          : 'group-hover:bg-black/5'
      }`} />
      
      {/* Animated lines - cleaner and simpler */}
      <div className="relative w-5 h-4 flex flex-col justify-between">
        <motion.span 
          className={`w-full h-[1.5px] rounded-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-300' : 'bg-slate-600'
          } group-hover:bg-orange-500`}
          animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        <motion.span 
          className={`w-full h-[1.5px] rounded-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-300' : 'bg-slate-600'
          } group-hover:bg-orange-500`}
          animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span 
          className={`w-full h-[1.5px] rounded-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-300' : 'bg-slate-600'
          } group-hover:bg-orange-500`}
          animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
};

// Enhanced menu item with hover effects
const MenuItem = ({ href, label, onClick, delay }: { href: string; label: string; onClick: () => void; delay: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Link 
        href={href} 
        className={`relative flex items-center gap-3 text-xl font-light py-4 transition-all duration-300 tracking-wide group ${
          theme === 'dark' 
            ? 'text-slate-200 hover:text-orange-400' 
            : 'text-slate-700 hover:text-orange-500'
        }`}
        onClick={onClick}
      >
        {/* Hover background */}
        <motion.div
          className="absolute -left-4 -right-4 top-0 bottom-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Animated indicator */}
        <motion.div
          className="relative w-8 h-[2px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          initial={{ width: "8px" }}
          animate={{ width: isHovered ? "24px" : "8px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        <span className="relative">{label}</span>
        
        {/* Arrow icon */}
        <motion.div
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-orange-400" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

// Theme toggle menu item component
const ThemeMenuItem = ({ onClick, delay }: { onClick: () => void; delay: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <div className={`relative flex items-center gap-3 text-xl font-light py-4 transition-all duration-300 tracking-wide group ${
        theme === 'dark' 
          ? 'text-slate-200 hover:text-orange-400' 
          : 'text-slate-700 hover:text-orange-500'
      }`}>
        {/* Hover background */}
        <motion.div
          className="absolute -left-4 -right-4 top-0 bottom-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Animated indicator */}
        <motion.div
          className="relative w-8 h-[2px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          initial={{ width: "8px" }}
          animate={{ width: isHovered ? "24px" : "8px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        <div className="relative flex items-center gap-3 flex-1">
          <span>Theme</span>
          <div className="ml-auto">
            <ThemeToggle variant="icon" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const { theme } = useTheme();
  
  // Mouse position tracking for gradient effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const gradientX = useTransform(mouseX, [0, 300], [0, 100]);
  const gradientY = useTransform(mouseY, [0, 300], [0, 100]);
  const springX = useSpring(gradientX, { stiffness: 300, damping: 30 });
  const springY = useSpring(gradientY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header visibility logic
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      // Scrolled state
      setIsScrolled(currentScrollY > 50);
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Dynamic header classes based on theme and scroll state
  const getHeaderClasses = () => {
    const baseClasses = "fixed top-0 z-50 w-full transition-all duration-700 ease-out h-16 md:h-20 flex items-center";
    
    if (theme === 'dark') {
      return `${baseClasses} ${isScrolled 
        ? 'bg-black/90 backdrop-blur-2xl shadow-2xl shadow-black/80 border-b border-white/5' 
        : 'bg-black/60 backdrop-blur-xl'
      }`;
    } else {
      return `${baseClasses} ${isScrolled 
        ? 'header-light scrolled' 
        : 'header-light'
      }`;
    }
  };

  // Dynamic mobile menu classes
  const getMobileMenuClasses = () => {
    const baseClasses = "fixed left-0 top-0 bottom-0 z-[100] w-80 md:w-96 backdrop-blur-2xl border-r";
    
    if (theme === 'dark') {
      return `${baseClasses} bg-black/95 border-white/10`;
    } else {
      return `${baseClasses} mobile-menu-light border-black/10`;
    }
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        animate={isHeaderVisible ? "visible" : "hidden"}
        initial="visible"
        onMouseMove={handleMouseMove}
        className={getHeaderClasses()}
      >
        {/* Animated gradient background */}
        <motion.div 
          className={`absolute inset-0 ${theme === 'dark' ? 'opacity-50' : 'opacity-30'}`}
          style={{
            background: `radial-gradient(circle at ${springX}% ${springY}%, rgba(251, 146, 60, ${theme === 'dark' ? '0.15' : '0.08'}) 0%, transparent 50%)`,
          }}
        />
        
        {/* Top gradient line */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent ${theme === 'light' ? 'opacity-60' : ''}`} />
        
        {/* Glass morphism overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${
          theme === 'dark' 
            ? 'from-white/[0.02] to-transparent' 
            : 'from-white/[0.4] to-transparent'
        }`} />
        
        <div className="container relative flex max-w-screen-2xl items-center justify-between px-6 md:px-8 h-full w-full mx-auto">
          {/* Left: Enhanced Hamburger */}
          <div className="flex-shrink-0 w-12 flex justify-start">
            <AnimatedHamburger isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </div>

          {/* Center: Enhanced Logo - Properly centered and responsive */}
          <div className="flex-1 flex justify-center items-center">
            <Link href="/" className="flex items-center group">
              <motion.div 
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Logo glow effect */}
                <div className="absolute inset-0 bg-orange-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Image
                  src={theme === 'light' ? "/zeropoint-logo-black.png" : "/zeropoint-logo.png"}
                  alt="Zero Point Labs Logo"
                  width={280}
                  height={320}
                  className="relative rounded-lg transition-all duration-300 group-hover:brightness-110 w-auto h-8 sm:h-10 md:h-12 max-w-none"
                  priority
                />
              </motion.div>
            </Link>
          </div>
          
          {/* Right: Contact Button */}
          <div className="flex-shrink-0 w-12 md:w-auto flex justify-end">
            <div className="hidden md:block">
              <Link href="/contact" className="relative group">
                <motion.div
                  className="relative px-6 py-2.5 text-sm font-medium rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button gradient border */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 p-[1px]">
                    <div className={`absolute inset-[1px] rounded-xl ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} />
                  </div>
                  
                  {/* Button content */}
                  <span className="relative z-10 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-400 transition-all duration-300">
                    Contact Us
                  </span>
                  
                  {/* Animated border beam */}
                  <BorderBeam size={60} duration={3} colorFrom="#fb923c" colorTo="#ea580c" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Slide-out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-0 z-[90] backdrop-blur-md ${
                theme === 'dark' ? 'bg-black/60' : 'bg-white/60'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Enhanced Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={getMobileMenuClasses()}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none ${
                theme === 'light' ? 'opacity-60' : ''
              }`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-16">
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center ${
                      theme === 'light' ? 'border-orange-500/50' : ''
                    }`}>
                      <Sparkles className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className={`font-medium text-lg ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>Navigation</div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                      }`}>Explore our services</div>
                    </div>
                  </motion.div>
                  
                  <motion.button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                      theme === 'dark' 
                        ? 'text-slate-400 hover:text-orange-400 hover:bg-white/5' 
                        : 'text-slate-600 hover:text-orange-500 hover:bg-black/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
                  </motion.button>
                </div>
                
                {/* Navigation items */}
                <nav className="flex flex-col space-y-3 flex-grow">
                  {navItems.map((item, index) => (
                    <MenuItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      onClick={() => setIsMobileMenuOpen(false)}
                      delay={index * 0.1 + 0.2}
                    />
                  ))}
                  
                  {/* Theme Toggle Item */}
                  <ThemeMenuItem
                    onClick={() => setIsMobileMenuOpen(false)}
                    delay={navItems.length * 0.1 + 0.2}
                  />
                </nav>

                {/* Bottom section with contact button */}
                <motion.div 
                  className={`mt-auto pt-8 border-t ${
                    theme === 'dark' ? 'border-white/10' : 'border-black/10'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      className="relative w-full py-3.5 text-center rounded-xl overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <span className="relative z-10 text-white font-semibold text-base">Contact Us</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 