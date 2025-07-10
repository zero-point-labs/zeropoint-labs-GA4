'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugConfig() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      setConfig({ error: 'Failed to fetch config' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-check on component mount
    checkConfig();
  }, []);

  if (!config) return null;

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50/50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">
          Debug: Configuration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          <div className="font-mono">
            <strong>Client-side Variables:</strong>
          </div>
          <div className="pl-2 space-y-1">
            <div>APPWRITE_ENDPOINT: {config.config?.appwrite?.endpoint}</div>
            <div>APPWRITE_PROJECT_ID: {config.config?.appwrite?.projectId}</div>
            <div>APP_URL: {config.config?.app?.url}</div>
          </div>
          
          <div className="font-mono pt-2">
            <strong>Server-side Variables:</strong>
          </div>
          <div className="pl-2 space-y-1">
            <div>APPWRITE_API_KEY: {config.config?.appwrite?.hasApiKey ? '✅ SET' : '❌ NOT_SET'}</div>
            <div>DATABASE_ID: {config.config?.appwrite?.databaseId}</div>
            <div>CLIENTS_COLLECTION: {config.config?.appwrite?.clientsCollectionId}</div>
          </div>
        </div>
        
        <Button 
          onClick={checkConfig} 
          disabled={loading}
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          {loading ? 'Checking...' : 'Refresh Config'}
        </Button>
      </CardContent>
    </Card>
  );
} 