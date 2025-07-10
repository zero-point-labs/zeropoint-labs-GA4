"use client";

import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const iconVariants = {
    initial: { scale: 0.5, rotate: -90, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0.5, rotate: 90, opacity: 0 }
  };

  if (variant === 'full') {
    return (
      <Button
        onClick={toggleTheme}
        variant="ghost"
        className={`w-full justify-start gap-3 text-slate-400 hover:text-foreground hover:bg-muted transition-colors ${className}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Moon className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </Button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-10 h-10 rounded-lg bg-background/80 hover:bg-muted border border-border hover:border-orange-500/50 transition-all duration-300 group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-600/5 group-hover:to-transparent transition-all duration-500 rounded-lg" />
      
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Sun className="h-5 w-5 text-orange-400 group-hover:text-orange-300" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Moon className="h-5 w-5 text-slate-600 group-hover:text-orange-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-lg bg-orange-500/20 blur-xl" />
      </div>
    </motion.button>
  );
} 