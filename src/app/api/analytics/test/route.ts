import { NextRequest, NextResponse } from 'next/server';
import GoogleAnalyticsService from '@/lib/google-analytics';
import { Client, Databases } from 'node-appwrite';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

export async function GET(request: NextRequest) {
  let gaPropertyId: string = '';
  let context: string = '';
  
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const propertyId = searchParams.get('propertyId');

    // If clientId is provided, fetch the Property ID from the database
    if (clientId) {
      try {
        const clientDoc = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
          process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'clients',
          clientId
        );

        gaPropertyId = clientDoc.googleAnalyticsPropertyId;
        context = `client: ${clientDoc.clientName} (${clientDoc.websiteDomain})`;
        
        if (!gaPropertyId) {
          return NextResponse.json({
            success: false,
            connected: false,
            error: 'No Google Analytics Property ID configured for this client',
            context,
          }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          connected: false,
          error: 'Client not found',
          clientId,
        }, { status: 404 });
      }
    } else if (propertyId) {
      // Use the provided Property ID directly
      gaPropertyId = propertyId;
      context = `property ID: ${propertyId}`;
    } else {
      // Fall back to environment variable for backward compatibility
      gaPropertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
      context = 'default environment property';
      
      if (!gaPropertyId) {
        return NextResponse.json({
          success: false,
          connected: false,
          error: 'No Property ID provided. Use clientId or propertyId parameter, or set GOOGLE_ANALYTICS_PROPERTY_ID environment variable.',
        }, { status: 400 });
      }
    }

    console.log('Testing Google Analytics connection...');
    console.log(`Property ID: ${gaPropertyId}`);
    console.log(`Context: ${context}`);
    console.log(`Credentials file: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

    // Create analytics service with the specific Property ID
    const analyticsService = GoogleAnalyticsService.withPropertyId(gaPropertyId);

    // Test connection by fetching basic metrics
    const testData = await analyticsService.getBasicMetrics({
      startDate: '7daysAgo',
      endDate: 'today'
    });

    console.log('Google Analytics connection successful!');

    return NextResponse.json({
      success: true,
      connected: true,
      message: `Google Analytics connection successful for ${context}!`,
      propertyId: gaPropertyId,
      context,
      testData,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error fetching basic metrics:', error);
    console.error('Google Analytics connection test failed:', error);

    return NextResponse.json({
      success: false,
      connected: false,
      error: 'Google Analytics connection failed',
      details: error.message,
      propertyId: gaPropertyId || 'unknown',
      context: context || 'unknown',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 