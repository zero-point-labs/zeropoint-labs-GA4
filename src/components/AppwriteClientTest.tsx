'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { appwriteConfig, databases } from '@/lib/appwrite';

export default function AppwriteClientTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testClientSideAppwrite = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing client-side Appwrite with config:', {
        endpoint: appwriteConfig.endpoint,
        projectId: appwriteConfig.projectId,
        databaseId: appwriteConfig.databaseId,
        clientsCollectionId: appwriteConfig.clientsCollectionId,
      });

      // Test 1: Try to list documents (this should work if properly configured)
      const testResult = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.clientsCollectionId
      );

      setResult({
        success: true,
        message: 'Client-side Appwrite connection successful!',
        documentCount: testResult.documents.length,
        config: {
          endpoint: appwriteConfig.endpoint,
          projectId: appwriteConfig.projectId,
          databaseId: appwriteConfig.databaseId,
          clientsCollectionId: appwriteConfig.clientsCollectionId,
        }
      });

    } catch (error: any) {
      console.error('Client-side Appwrite test failed:', error);
      setResult({
        success: false,
        error: error.message,
        code: error.code,
        type: error.type,
        config: {
          endpoint: appwriteConfig.endpoint,
          projectId: appwriteConfig.projectId,
          databaseId: appwriteConfig.databaseId,
          clientsCollectionId: appwriteConfig.clientsCollectionId,
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-sm text-blue-800">
          Client-Side Appwrite Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={testClientSideAppwrite} 
          disabled={loading}
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          {loading ? 'Testing...' : 'Test Client-Side Appwrite'}
        </Button>

        {result && (
          <div className="text-xs space-y-2">
            <div className={`p-2 rounded ${
              result.success 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              <div className="font-semibold">
                {result.success ? '✅ SUCCESS' : '❌ FAILED'}
              </div>
              {result.message && <div>{result.message}</div>}
              {result.error && <div>Error: {result.error}</div>}
              {result.code && <div>Code: {result.code}</div>}
              {result.type && <div>Type: {result.type}</div>}
              {result.documentCount !== undefined && (
                <div>Documents found: {result.documentCount}</div>
              )}
            </div>
            
            <div className="text-xs">
              <div className="font-semibold">Config Used:</div>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {JSON.stringify(result.config, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 