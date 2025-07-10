"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/lib/theme-context';
import { sessionStorage, ClientSession } from '@/lib/auth';
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp, 
  LogOut, 
  Settings, 
  Calendar,
  Activity,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  MapPin,
  RefreshCw,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';

// Analytics data interfaces
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  sessionDuration: number;
  bounceRate: number;
}

interface TopPage {
  path: string;
  views: number;
  title?: string;
}

interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface GeoData {
  country: string;
  users: number;
}

interface AnalyticsResponse {
  success: boolean;
  data?: {
    metrics: AnalyticsData;
    topPages: TopPage[];
    deviceBreakdown: DeviceBreakdown;
    geoData: GeoData[];
    propertyId: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
  };
  error?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [session, setSession] = useState<ClientSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse['data'] | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Check authentication
  useEffect(() => {
    const userSession = sessionStorage.getSession();
    if (!userSession) {
      router.push('/login');
      return;
    }
    setSession(userSession);
    setLoading(false);
    
    // Fetch initial analytics data
    fetchAnalytics(userSession.clientId);
  }, [router]);

  const fetchAnalytics = async (clientId: string) => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    
    try {
      const response = await fetch(`/api/analytics?clientId=${clientId}&startDate=7daysAgo&endDate=today`);
      const data: AnalyticsResponse = await response.json();
      
      if (data.success && data.data) {
        setAnalyticsData(data.data);
        setLastUpdated(new Date());
      } else {
        setAnalyticsError(data.error || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsError('Failed to connect to analytics service');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clearSession();
    router.push('/');
  };

  const refreshData = () => {
    if (session) {
      fetchAnalytics(session.clientId);
    }
  };

  const formatSessionDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBounceRate = (rate: number): string => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  // Mock data fallback when no analytics data is available
  const getDisplayData = () => {
    if (analyticsData) {
      return {
        totalViews: analyticsData.metrics.pageViews,
        uniqueVisitors: analyticsData.metrics.uniqueVisitors,
        avgSessionDuration: formatSessionDuration(analyticsData.metrics.sessionDuration),
        bounceRate: formatBounceRate(analyticsData.metrics.bounceRate),
        topPages: analyticsData.topPages,
        deviceBreakdown: analyticsData.deviceBreakdown,
        recentVisitors: analyticsData.geoData.map(geo => ({
          country: geo.country,
          visitors: geo.users,
          flag: getCountryFlag(geo.country)
        }))
      };
    }
    
    // Fallback to zeros when no data
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      avgSessionDuration: '0m 0s',
      bounceRate: '0.0%',
      topPages: [],
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      recentVisitors: []
    };
  };

  const getCountryFlag = (country: string): string => {
    const countryFlags: { [key: string]: string } = {
      'Cyprus': '🇨🇾',
      'Greece': '🇬🇷',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'United States': '🇺🇸',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸'
    };
    return countryFlags[country] || '🌍';
  };

  const displayData = getDisplayData();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, active: true },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, active: false },
    { id: 'visitors', label: 'Visitors', icon: Users, active: false },
    { id: 'pages', label: 'Pages', icon: Globe, active: false },
    { id: 'settings', label: 'Settings', icon: Settings, active: false }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'
      }`}>
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className={`text-lg ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={`min-h-screen ${
      theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'
    }`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        theme === 'light' 
          ? 'bg-white border-r border-slate-200' 
          : 'bg-slate-800 border-r border-slate-700'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`p-6 border-b ${
            theme === 'light' ? 'border-slate-200' : 'border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${
                theme === 'light' ? 'text-slate-900' : 'text-slate-100'
              }`}>
                Dashboard
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Client Info */}
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-orange-500 text-white font-semibold">
                  {session.clientName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  {session.clientName}
                </p>
                <p className={`text-sm truncate ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {session.websiteDomain}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  item.active
                    ? theme === 'light'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-orange-950/50 text-orange-400 border border-orange-600/30'
                    : theme === 'light'
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className={`p-4 border-t ${
            theme === 'light' ? 'border-slate-200' : 'border-slate-700'
          }`}>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                theme === 'light'
                  ? 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                  : 'text-slate-400 hover:text-red-400 hover:bg-red-950/50'
              }`}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className={`sticky top-0 z-30 px-6 py-4 border-b ${
          theme === 'light' 
            ? 'bg-white/80 backdrop-blur-sm border-slate-200' 
            : 'bg-slate-900/80 backdrop-blur-sm border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  Website Analytics
                </h1>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {session.websiteDomain} • Last updated {lastUpdated.toLocaleTimeString()}
                  {analyticsData && (
                    <span className="ml-2">
                      • Property ID: {analyticsData.propertyId}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={analyticsLoading}
              >
                <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Badge variant="outline" className="gap-1">
                {analyticsError ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    Error
                  </>
                ) : (
                  <>
                    <Activity className="w-3 h-3" />
                    Live
                  </>
                )}
              </Badge>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Error Message */}
          {analyticsError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                theme === 'light'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-red-950/50 border-red-600/30 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <h4 className="font-medium">Analytics Error</h4>
                  <p className="text-sm opacity-90">{analyticsError}</p>
                  <p className="text-xs mt-1 opacity-75">
                    Make sure your Google Analytics Property ID is configured correctly.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading Overlay */}
          {analyticsLoading && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className={`p-6 rounded-lg shadow-xl ${
                theme === 'light' ? 'bg-white' : 'bg-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                  <span className={`text-lg ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Fetching analytics data...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Total Views
                      </p>
                      <p className={`text-2xl font-bold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.totalViews.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Unique Visitors
                      </p>
                      <p className={`text-2xl font-bold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.uniqueVisitors.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Avg. Session
                      </p>
                      <p className={`text-2xl font-bold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.avgSessionDuration}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Bounce Rate
                      </p>
                      <p className={`text-2xl font-bold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.bounceRate}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <MousePointer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    <Globe className="w-5 h-5" />
                    Top Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayData.topPages.length > 0 ? (
                      displayData.topPages.map((page, index) => (
                        <div key={page.path} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                            }`}>
                              {page.title || page.path}
                            </p>
                            <p className={`text-sm truncate ${
                              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {page.path}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                            }`}>
                              {page.views.toLocaleString()}
                            </p>
                            <p className={`text-sm ${
                              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              views
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={`text-center py-8 ${
                        theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        No page data available yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Device Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    <Monitor className="w-5 h-5" />
                    Device Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-blue-500" />
                        <span className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                          Desktop
                        </span>
                      </div>
                      <span className={`font-semibold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.deviceBreakdown.desktop}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-green-500" />
                        <span className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                          Mobile
                        </span>
                      </div>
                      <span className={`font-semibold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.deviceBreakdown.mobile}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-orange-500" />
                        <span className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                          Tablet
                        </span>
                      </div>
                      <span className={`font-semibold ${
                        theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {displayData.deviceBreakdown.tablet}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Visitor Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  <MapPin className="w-5 h-5" />
                  Visitor Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayData.recentVisitors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayData.recentVisitors.map((visitor, index) => (
                      <div 
                        key={visitor.country}
                        className={`p-4 rounded-lg border ${
                          theme === 'light' 
                            ? 'bg-slate-50 border-slate-200' 
                            : 'bg-slate-700 border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{visitor.flag}</span>
                          <div>
                            <p className={`font-medium ${
                              theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                            }`}>
                              {visitor.country}
                            </p>
                            <p className={`text-sm ${
                              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {visitor.visitors} visitors
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-8 ${
                    theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    No visitor data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 