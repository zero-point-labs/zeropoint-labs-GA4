import { BetaAnalyticsDataClient } from '@google-analytics/data';

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  sessionDuration: number;
  bounceRate: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface TopPage {
  path: string;
  views: number;
  title?: string;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface GeoData {
  country: string;
  users: number;
}

export class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor(propertyId?: string) {
    // Initialize client based on environment (production vs development)
    if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
      // Production deployment (Vercel) - use environment variables
      this.client = new BetaAnalyticsDataClient({
        credentials: {
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          project_id: process.env.GOOGLE_PROJECT_ID,
        },
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Local development - use credentials file
      this.client = new BetaAnalyticsDataClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
    } else {
      // Fallback - try default application credentials
      this.client = new BetaAnalyticsDataClient();
    }

    // Use provided propertyId or fall back to environment variable
    this.propertyId = propertyId || process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
    
    if (!this.propertyId) {
      throw new Error('Property ID is required - either provide it as a parameter or set GOOGLE_ANALYTICS_PROPERTY_ID environment variable');
    }
  }

  // Static method to create instances with specific Property IDs
  static withPropertyId(propertyId: string): GoogleAnalyticsService {
    return new GoogleAnalyticsService(propertyId);
  }

  // Method to get the current Property ID
  getPropertyId(): string {
    return this.propertyId;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Try to run a simple query to test the connection
      await this.getBasicMetrics({ startDate: '7daysAgo', endDate: 'today' });
      return true;
    } catch (error) {
      console.error('Google Analytics connection test failed:', error);
      return false;
    }
  }

  async getBasicMetrics(dateRange: DateRange): Promise<AnalyticsData> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      });

      // Extract metrics from response
      const metrics = response.rows?.[0]?.metricValues || [];
      
      return {
        pageViews: parseInt(metrics[0]?.value || '0'),
        uniqueVisitors: parseInt(metrics[1]?.value || '0'),
        sessionDuration: parseFloat(metrics[2]?.value || '0'),
        bounceRate: parseFloat(metrics[3]?.value || '0'),
      };
    } catch (error) {
      console.error('Error fetching basic metrics:', error);
      throw error;
    }
  }

  async getTopPages(dateRange: DateRange, limit: number = 10): Promise<TopPage[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' },
        ],
        metrics: [
          { name: 'screenPageViews' },
        ],
        orderBys: [
          {
            metric: {
              metricName: 'screenPageViews',
            },
            desc: true,
          },
        ],
        limit,
      });

      return response.rows?.map(row => ({
        path: row.dimensionValues?.[0]?.value || '',
        title: row.dimensionValues?.[1]?.value || '',
        views: parseInt(row.metricValues?.[0]?.value || '0'),
      })) || [];
    } catch (error) {
      console.error('Error fetching top pages:', error);
      throw error;
    }
  }

  async getDeviceBreakdown(dateRange: DateRange): Promise<DeviceBreakdown> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'deviceCategory' },
        ],
        metrics: [
          { name: 'totalUsers' },
        ],
      });

      const breakdown = { desktop: 0, mobile: 0, tablet: 0 };
      
      response.rows?.forEach(row => {
        const device = row.dimensionValues?.[0]?.value?.toLowerCase() || '';
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        
        if (device === 'desktop') breakdown.desktop = users;
        else if (device === 'mobile') breakdown.mobile = users;
        else if (device === 'tablet') breakdown.tablet = users;
      });

      return breakdown;
    } catch (error) {
      console.error('Error fetching device breakdown:', error);
      throw error;
    }
  }

  async getGeoData(dateRange: DateRange, limit: number = 10): Promise<GeoData[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'country' },
        ],
        metrics: [
          { name: 'totalUsers' },
        ],
        orderBys: [
          {
            metric: {
              metricName: 'totalUsers',
            },
            desc: true,
          },
        ],
        limit,
      });

      return response.rows?.map(row => ({
        country: row.dimensionValues?.[0]?.value || '',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
      })) || [];
    } catch (error) {
      console.error('Error fetching geo data:', error);
      throw error;
    }
  }

  async getRealTimeData(): Promise<AnalyticsData> {
    try {
      const [response] = await this.client.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [
          { name: 'activeUsers' },
        ],
      });

      const activeUsers = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');

      return {
        pageViews: 0, // Real-time page views not directly available
        uniqueVisitors: activeUsers,
        sessionDuration: 0,
        bounceRate: 0,
      };
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      throw error;
    }
  }
}

// Export a default instance using environment variables for backward compatibility
export const googleAnalytics = new GoogleAnalyticsService();

// Export the class for creating instances with specific Property IDs
export default GoogleAnalyticsService; 