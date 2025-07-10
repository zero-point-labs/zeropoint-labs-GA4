import { NextRequest, NextResponse } from 'next/server';
import GoogleAnalyticsService from '@/lib/google-analytics';
import { Client, Databases, Query } from 'node-appwrite';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const propertyId = searchParams.get('propertyId');
    const dateRange = {
      startDate: searchParams.get('startDate') || '7daysAgo',
      endDate: searchParams.get('endDate') || 'today',
    };

    let gaPropertyId: string;

    // If clientId is provided, fetch the Property ID from the database
    if (clientId) {
      try {
        const clientDoc = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
          process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'clients',
          clientId
        );

        gaPropertyId = clientDoc.googleAnalyticsPropertyId;
        
        if (!gaPropertyId) {
          return NextResponse.json(
            { error: 'No Google Analytics Property ID configured for this client' },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
    } else if (propertyId) {
      // Use the provided Property ID directly
      gaPropertyId = propertyId;
    } else {
      // Fall back to environment variable for backward compatibility
      gaPropertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
      if (!gaPropertyId) {
        return NextResponse.json(
          { error: 'No Property ID provided. Use clientId or propertyId parameter.' },
          { status: 400 }
        );
      }
    }

    // Create analytics service with the specific Property ID
    const analyticsService = GoogleAnalyticsService.withPropertyId(gaPropertyId);

    // Fetch analytics data
    const [basicMetrics, topPages, deviceBreakdown, geoData] = await Promise.all([
      analyticsService.getBasicMetrics(dateRange),
      analyticsService.getTopPages(dateRange, 10),
      analyticsService.getDeviceBreakdown(dateRange),
      analyticsService.getGeoData(dateRange, 10),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        propertyId: gaPropertyId,
        dateRange,
        metrics: basicMetrics,
        topPages,
        deviceBreakdown,
        geoData,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, propertyId, dateRange } = body;

    let gaPropertyId: string;

    // If clientId is provided, fetch the Property ID from the database
    if (clientId) {
      try {
        const clientDoc = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
          process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'clients',
          clientId
        );

        gaPropertyId = clientDoc.googleAnalyticsPropertyId;
        
        if (!gaPropertyId) {
          return NextResponse.json(
            { error: 'No Google Analytics Property ID configured for this client' },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
    } else if (propertyId) {
      gaPropertyId = propertyId;
    } else {
      gaPropertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
      if (!gaPropertyId) {
        return NextResponse.json(
          { error: 'No Property ID provided. Use clientId or propertyId in request body.' },
          { status: 400 }
        );
      }
    }

    // Create analytics service with the specific Property ID
    const analyticsService = GoogleAnalyticsService.withPropertyId(gaPropertyId);

    // Fetch comprehensive analytics data
    const [basicMetrics, topPages, deviceBreakdown, geoData] = await Promise.all([
      analyticsService.getBasicMetrics(dateRange || { startDate: '7daysAgo', endDate: 'today' }),
      analyticsService.getTopPages(dateRange || { startDate: '7daysAgo', endDate: 'today' }, 10),
      analyticsService.getDeviceBreakdown(dateRange || { startDate: '7daysAgo', endDate: 'today' }),
      analyticsService.getGeoData(dateRange || { startDate: '7daysAgo', endDate: 'today' }, 10),
    ]);

    // Store analytics data in database for historical tracking
    try {
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
        process.env.APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics',
        'unique()',
        {
          clientId: clientId || 'default',
          websiteDomain: 'unknown', // Could be fetched from client data
          pageViews: basicMetrics.pageViews,
          uniqueVisitors: basicMetrics.uniqueVisitors,
          sessionDuration: basicMetrics.sessionDuration,
          bounceRate: basicMetrics.bounceRate,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          timestamp: new Date().toISOString(),
        }
      );
    } catch (dbError) {
      console.error('Failed to store analytics in database:', dbError);
      // Continue execution - don't fail the request if database storage fails
    }

    return NextResponse.json({
      success: true,
      data: {
        propertyId: gaPropertyId,
        dateRange: dateRange || { startDate: '7daysAgo', endDate: 'today' },
        metrics: basicMetrics,
        topPages,
        deviceBreakdown,
        geoData,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
} 