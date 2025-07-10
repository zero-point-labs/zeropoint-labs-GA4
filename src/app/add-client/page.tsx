"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { useTheme } from '@/lib/theme-context';
import { appwriteService, generateTrackingScript } from '@/lib/appwrite';
import { hashPassword, validateClientData, generateSecurePassword } from '@/lib/auth';
import { ArrowLeft, UserPlus, Loader2, AlertCircle, CheckCircle, Copy, User, Lock, Globe, Hash, RefreshCw } from 'lucide-react';

interface ClientFormData {
  clientName: string;
  username: string;
  password: string;
  websiteDomain: string;
  googleAnalyticsPropertyId: string;
}

interface CreatedClient {
  id: string;
  clientName: string;
  username: string;
  password: string; // Plain text for display only
  websiteDomain: string;
  trackingId: string;
  trackingScript: string;
}

export default function AddClientPage() {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState<ClientFormData>({
    clientName: '',
    username: '',
    password: '',
    websiteDomain: '',
    googleAnalyticsPropertyId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdClient, setCreatedClient] = useState<CreatedClient | null>(null);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const generatePassword = () => {
    const newPassword = generateSecurePassword(12);
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form data
      const validation = validateClientData(formData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Hash the password
      const hashedPassword = await hashPassword(formData.password);

      // Create client in database
      const clientData = {
        clientName: formData.clientName.trim(),
        username: formData.username.trim().toLowerCase(),
        password: hashedPassword,
        websiteDomain: formData.websiteDomain.trim().replace(/^https?:\/\//, ''),
        googleAnalyticsPropertyId: formData.googleAnalyticsPropertyId.trim(),
        isActive: true
      };

      const newClient = await appwriteService.createClient(clientData);
      
      // Generate tracking script
      const trackingScript = generateTrackingScript(newClient.trackingId, newClient.websiteDomain);
      
      setCreatedClient({
        id: newClient.$id || '',
        clientName: newClient.clientName,
        username: newClient.username,
        password: formData.password, // Store plain text for display
        websiteDomain: newClient.websiteDomain,
        trackingId: newClient.trackingId,
        trackingScript
      });
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        clientName: '',
        username: '',
        password: '',
        websiteDomain: '',
        googleAnalyticsPropertyId: ''
      });
      
    } catch (err: any) {
      console.error('Client creation error:', err);
      setError(err.message || 'Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setCreatedClient(null);
    setError(null);
    setCopied({});
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
    <div className={`min-h-screen py-12 px-4 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
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
                <UserPlus className="w-8 h-8" />
              </div>
            </div>
            
            <h1 className={`text-3xl font-bold ${
              theme === 'light' ? 'text-slate-900' : 'text-slate-100'
            }`}>
              Add New Client
            </h1>
            <p className={`text-sm ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Create a new client account with dashboard access
            </p>
          </div>

          {success && createdClient ? (
            /* Success View */
            <motion.div variants={cardVariants}>
              <Card className={`shadow-xl border ${
                theme === 'light'
                  ? 'bg-white/80 border-green-200/60 shadow-green-200/50'
                  : 'bg-slate-800/50 border-green-700/50 shadow-black/20'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl text-center flex items-center gap-2 justify-center ${
                    theme === 'light' ? 'text-green-800' : 'text-green-400'
                  }`}>
                    <CheckCircle className="w-6 h-6" />
                    Client Created Successfully!
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Client Details */}
                  <div className="space-y-4">
                    <h3 className={`font-semibold text-lg ${
                      theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      Client Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={`text-sm ${
                          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          Client Name
                        </Label>
                        <div className={`p-3 rounded-lg border ${
                          theme === 'light' 
                            ? 'bg-slate-50 border-slate-200' 
                            : 'bg-slate-700 border-slate-600'
                        }`}>
                          {createdClient.clientName}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className={`text-sm ${
                          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          Website Domain
                        </Label>
                        <div className={`p-3 rounded-lg border ${
                          theme === 'light' 
                            ? 'bg-slate-50 border-slate-200' 
                            : 'bg-slate-700 border-slate-600'
                        }`}>
                          {createdClient.websiteDomain}
                        </div>
                      </div>
                    </div>

                    {/* Login Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={`text-sm ${
                          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          Username
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className={`flex-1 p-3 rounded-lg border font-mono text-sm ${
                            theme === 'light' 
                              ? 'bg-blue-50 border-blue-200 text-blue-800' 
                              : 'bg-blue-950 border-blue-700 text-blue-300'
                          }`}>
                            {createdClient.username}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(createdClient.username, 'username')}
                            className="px-3"
                          >
                            {copied.username ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className={`text-sm ${
                          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          Password
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className={`flex-1 p-3 rounded-lg border font-mono text-sm ${
                            theme === 'light' 
                              ? 'bg-blue-50 border-blue-200 text-blue-800' 
                              : 'bg-blue-950 border-blue-700 text-blue-300'
                          }`}>
                            {createdClient.password}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(createdClient.password, 'password')}
                            className="px-3"
                          >
                            {copied.password ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Information */}
                    <div className="space-y-2">
                      <Label className={`text-sm ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Tracking ID
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 p-3 rounded-lg border font-mono text-xs ${
                          theme === 'light' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-green-950 border-green-700 text-green-300'
                        }`}>
                          {createdClient.trackingId}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(createdClient.trackingId, 'trackingId')}
                          className="px-3"
                        >
                          {copied.trackingId ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Tracking Script */}
                    <div className="space-y-2">
                      <Label className={`text-sm ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Tracking Script (Add to client's website)
                      </Label>
                      <div className="relative">
                        <pre className={`p-4 rounded-lg border overflow-x-auto text-xs font-mono ${
                          theme === 'light' 
                            ? 'bg-slate-50 border-slate-200 text-slate-800' 
                            : 'bg-slate-800 border-slate-600 text-slate-300'
                        }`}>
                          {createdClient.trackingScript}
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(createdClient.trackingScript, 'script')}
                          className="absolute top-2 right-2"
                        >
                          {copied.script ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={resetForm}
                      className={`flex-1 ${
                        theme === 'light'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      Add Another Client
                    </Button>
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Form View */
            <motion.div variants={cardVariants}>
              <Card className={`shadow-xl border ${
                theme === 'light'
                  ? 'bg-white/80 border-slate-200/60 shadow-slate-200/50'
                  : 'bg-slate-800/50 border-slate-700/50 shadow-black/20'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl text-center ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    Client Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
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
                    {/* Client Name */}
                    <div className="space-y-2">
                      <Label htmlFor="clientName" className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Client Name *
                      </Label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <Input
                          id="clientName"
                          name="clientName"
                          type="text"
                          required
                          value={formData.clientName}
                          onChange={handleInputChange}
                          disabled={loading}
                          placeholder="e.g. John's Business"
                          className={`pl-10 ${
                            theme === 'light'
                              ? 'border-slate-300 focus:border-orange-500'
                              : 'border-slate-600 focus:border-orange-500 bg-slate-700/50'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Username *
                      </Label>
                      <div className="relative">
                        <Hash className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          required
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={loading}
                          placeholder="e.g. johnbusiness"
                          className={`pl-10 ${
                            theme === 'light'
                              ? 'border-slate-300 focus:border-orange-500'
                              : 'border-slate-600 focus:border-orange-500 bg-slate-700/50'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Password *
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                          }`} />
                          <Input
                            id="password"
                            name="password"
                            type="text"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Enter password"
                            className={`pl-10 ${
                              theme === 'light'
                                ? 'border-slate-300 focus:border-orange-500'
                                : 'border-slate-600 focus:border-orange-500 bg-slate-700/50'
                            }`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generatePassword}
                          disabled={loading}
                          className="px-3"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Website Domain */}
                    <div className="space-y-2">
                      <Label htmlFor="websiteDomain" className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Website Domain *
                      </Label>
                      <div className="relative">
                        <Globe className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <Input
                          id="websiteDomain"
                          name="websiteDomain"
                          type="text"
                          required
                          value={formData.websiteDomain}
                          onChange={handleInputChange}
                          disabled={loading}
                          placeholder="e.g. example.com"
                          className={`pl-10 ${
                            theme === 'light'
                              ? 'border-slate-300 focus:border-orange-500'
                              : 'border-slate-600 focus:border-orange-500 bg-slate-700/50'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Google Analytics Property ID */}
                    <div className="space-y-2">
                      <Label htmlFor="googleAnalyticsPropertyId" className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        Google Analytics Property ID (Optional)
                      </Label>
                      <Input
                        id="googleAnalyticsPropertyId"
                        name="googleAnalyticsPropertyId"
                        type="text"
                        value={formData.googleAnalyticsPropertyId}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="e.g. 123456789"
                        className={`${
                          theme === 'light'
                            ? 'border-slate-300 focus:border-orange-500'
                            : 'border-slate-600 focus:border-orange-500 bg-slate-700/50'
                        }`}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 text-base font-semibold transition-all duration-300 ${
                        loading
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
                          Creating Client...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Create Client Account
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 