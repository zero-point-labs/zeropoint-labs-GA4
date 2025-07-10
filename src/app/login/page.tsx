"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { useTheme } from '@/lib/theme-context';
import { authenticateClient, createClientSession, sessionStorage } from '@/lib/auth';
import { ArrowLeft, LogIn, Loader2, AlertCircle, CheckCircle, User, Lock } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (sessionStorage.isLoggedIn()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Basic validation
      if (!formData.username.trim() || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Authenticate with backend
      const client = await authenticateClient(formData);
      
      if (!client) {
        throw new Error('Invalid username or password');
      }

      // Create and store session
      const session = createClientSession(client);
      sessionStorage.setSession(session);
      
      setSuccess(true);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.1, duration: 0.3 }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              theme === 'light' 
                ? 'text-slate-600 hover:text-slate-900' 
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              theme === 'light'
                ? 'bg-orange-50 border-orange-200 text-orange-600'
                : 'bg-orange-950/50 border-orange-600/30 text-orange-400'
            }`}>
              <LogIn className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className={`text-2xl font-bold ${
            theme === 'light' ? 'text-slate-900' : 'text-slate-100'
          }`}>
            Client Dashboard Access
          </h1>
          <p className={`text-sm ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Sign in to view your website analytics
          </p>
        </div>

        {/* Login Form */}
        <motion.div variants={cardVariants}>
          <Card className={`shadow-xl border ${
            theme === 'light'
              ? 'bg-white/80 border-slate-200/60 shadow-slate-200/50'
              : 'bg-slate-800/50 border-slate-700/50 shadow-black/20'
          }`}>
            <CardHeader className="space-y-1">
              <CardTitle className={`text-xl text-center ${
                theme === 'light' ? 'text-slate-900' : 'text-slate-100'
              }`}>
                Sign In
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert className={`border ${
                    theme === 'light'
                      ? 'border-green-200 bg-green-50 text-green-800'
                      : 'border-green-600/30 bg-green-950/50 text-green-400'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                    <div className="ml-2">
                      <h4 className="font-medium">Success!</h4>
                      <p className="text-sm opacity-90">Redirecting to your dashboard...</p>
                    </div>
                  </Alert>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert className={`border ${
                    theme === 'light'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-red-600/30 bg-red-950/50 text-red-400'
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                    <div className="ml-2">
                      <h4 className="font-medium">Error</h4>
                      <p className="text-sm opacity-90">{error}</p>
                    </div>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className={`text-sm font-medium ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Username
                  </Label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={loading || success}
                      placeholder="Enter your username"
                      className={`pl-10 transition-all duration-200 ${
                        theme === 'light'
                          ? 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                          : 'border-slate-600 focus:border-orange-500 focus:ring-orange-500/20 bg-slate-700/50'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className={`text-sm font-medium ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading || success}
                      placeholder="Enter your password"
                      className={`pl-10 transition-all duration-200 ${
                        theme === 'light'
                          ? 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                          : 'border-slate-600 focus:border-orange-500 focus:ring-orange-500/20 bg-slate-700/50'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full py-3 text-base font-semibold transition-all duration-300 ${
                    loading || success
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-[1.02] hover:shadow-lg'
                  } ${
                    theme === 'light'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing In...
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Redirecting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className={`text-center text-sm ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <p>Need help? Contact{' '}
            <a 
              href="mailto:hello@zeropointlabs.com"
              className={`font-medium transition-colors ${
                theme === 'light'
                  ? 'text-orange-600 hover:text-orange-700'
                  : 'text-orange-400 hover:text-orange-300'
              }`}
            >
              support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 