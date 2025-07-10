import { Client, Account, Databases, ID, Query } from 'appwrite';

// Appwrite configuration
export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
  clientsCollectionId: process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'clients',
  analyticsCollectionId: process.env.APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics',
};

// Create Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);

// Client interface
export interface ClientData {
  $id?: string;
  clientName: string;
  username: string;
  password: string;
  websiteDomain: string;
  trackingId: string;
  googleAnalyticsPropertyId?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Analytics data interface
export interface AnalyticsData {
  $id?: string;
  clientId: string;
  websiteDomain: string;
  pageViews: number;
  uniqueVisitors: number;
  sessionDuration: number;
  bounceRate: number;
  trafficSources: Record<string, number>;
  deviceInfo: Record<string, number>;
  geoData: Record<string, number>;
  date: string;
  timestamp: string;
}

// Database operations
export class AppwriteService {
  // Create a new client
  async createClient(clientData: Omit<ClientData, '$id' | 'createdAt' | 'trackingId'>): Promise<ClientData> {
    try {
      const trackingId = `zp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newClient = {
        ...clientData,
        trackingId,
        createdAt: new Date().toISOString(),
      };

      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.clientsCollectionId,
        ID.unique(),
        newClient
      );

      return response as ClientData;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Get client by username
  async getClientByUsername(username: string): Promise<ClientData | null> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.clientsCollectionId,
        [Query.equal('username', username)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as ClientData;
      }
      return null;
    } catch (error) {
      console.error('Error getting client:', error);
      return null;
    }
  }

  // Update client last login
  async updateClientLastLogin(clientId: string): Promise<void> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.clientsCollectionId,
        clientId,
        { lastLogin: new Date().toISOString() }
      );
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Store analytics data
  async storeAnalyticsData(analyticsData: Omit<AnalyticsData, '$id'>): Promise<void> {
    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.analyticsCollectionId,
        ID.unique(),
        analyticsData
      );
    } catch (error) {
      console.error('Error storing analytics data:', error);
      throw error;
    }
  }

  // Get analytics data for a client
  async getClientAnalytics(clientId: string, startDate?: string, endDate?: string): Promise<AnalyticsData[]> {
    try {
      const queries = [Query.equal('clientId', clientId)];
      
      if (startDate) {
        queries.push(Query.greaterThanEqual('date', startDate));
      }
      if (endDate) {
        queries.push(Query.lessThanEqual('date', endDate));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.analyticsCollectionId,
        queries
      );

      return response.documents as AnalyticsData[];
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return [];
    }
  }

  // Get all clients (admin only)
  async getAllClients(): Promise<ClientData[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.clientsCollectionId
      );

      return response.documents as ClientData[];
    } catch (error) {
      console.error('Error getting all clients:', error);
      return [];
    }
  }
}

// Export service instance
export const appwriteService = new AppwriteService();

// Utility functions
export const generateTrackingScript = (trackingId: string, websiteDomain: string) => {
  return `<!-- Zeropoint Labs Analytics -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/analytics.js';
    script.setAttribute('data-website', '${websiteDomain}');
    script.setAttribute('data-tracking-id', '${trackingId}');
    script.setAttribute('data-api', '/api/analytics/track');
    document.head.appendChild(script);
  })();
</script>`;
};

export { ID, Query } from 'appwrite'; 