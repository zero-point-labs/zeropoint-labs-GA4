import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const config = {
      appwrite: {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'NOT_SET',
        projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'NOT_SET',
        hasApiKey: !!process.env.APPWRITE_API_KEY,
        databaseId: process.env.APPWRITE_DATABASE_ID || 'NOT_SET',
        clientsCollectionId: process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'NOT_SET',
        analyticsCollectionId: process.env.APPWRITE_ANALYTICS_COLLECTION_ID || 'NOT_SET',
      },
      app: {
        url: process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
        nodeEnv: process.env.NODE_ENV,
      }
    };

    return NextResponse.json({
      success: true,
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Configuration test failed', details: error.message },
      { status: 500 }
    );
  }
} 