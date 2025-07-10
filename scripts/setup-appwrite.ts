#!/usr/bin/env ts-node

import { Client, Databases, ID, Permission, Role, IndexType } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config(); // This will automatically look for .env files

interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId: string;
  clientsCollectionId: string;
  analyticsCollectionId: string;
}

const config: AppwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
  clientsCollectionId: process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'clients',
  analyticsCollectionId: process.env.APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics',
};

class AppwriteSetup {
  private client: Client;
  private databases: Databases;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(config.endpoint)
      .setProject(config.projectId)
      .setKey(config.apiKey);
    
    this.databases = new Databases(this.client);
  }

  async validateConfig() {
    console.log('🔍 Validating configuration...');
    
    if (!config.projectId) {
      throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is required in .env.local');
    }
    
    if (!config.apiKey) {
      throw new Error('APPWRITE_API_KEY is required in .env.local');
    }
    
    console.log('✅ Configuration validated');
  }

  async createDatabase() {
    try {
      console.log(`🗄️  Creating database: ${config.databaseId}...`);
      
      await this.databases.create(
        config.databaseId,
        'Zeropoint Dashboard Database'
      );
      
      console.log('✅ Database created successfully');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Database already exists, skipping...');
      } else {
        throw error;
      }
    }
  }

  async createClientsCollection() {
    let collectionExists = false;
    
    try {
      console.log(`📋 Creating clients collection: ${config.clientsCollectionId}...`);
      
      // Create collection
      await this.databases.createCollection(
        config.databaseId,
        config.clientsCollectionId,
        'Clients',
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );

      // Create attributes
      const attributes = [
        { key: 'clientName', type: 'string', size: 255, required: true },
        { key: 'username', type: 'string', size: 100, required: true },
        { key: 'password', type: 'string', size: 255, required: true },
        { key: 'websiteDomain', type: 'string', size: 255, required: true },
        { key: 'trackingId', type: 'string', size: 100, required: true },
        { key: 'googleAnalyticsPropertyId', type: 'string', size: 100, required: false },
        { key: 'isActive', type: 'boolean', required: true },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'lastLogin', type: 'datetime', required: false },
      ];

      for (const attr of attributes) {
        console.log(`  📝 Adding attribute: ${attr.key}...`);
        
        if (attr.type === 'string') {
          await this.databases.createStringAttribute(
            config.databaseId,
            config.clientsCollectionId,
            attr.key,
            attr.size || 255,
            attr.required
          );
        } else if (attr.type === 'boolean') {
          await this.databases.createBooleanAttribute(
            config.databaseId,
            config.clientsCollectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'datetime') {
          await this.databases.createDatetimeAttribute(
            config.databaseId,
            config.clientsCollectionId,
            attr.key,
            attr.required
          );
        }
      }

      // Create indexes
      const indexes = [
        { key: 'username_index', attributes: ['username'] },
        { key: 'tracking_id_index', attributes: ['trackingId'] },
        { key: 'domain_index', attributes: ['websiteDomain'] },
        { key: 'active_index', attributes: ['isActive'] },
      ];

      for (const index of indexes) {
        console.log(`  🔍 Creating index: ${index.key}...`);
        await this.databases.createIndex(
          config.databaseId,
          config.clientsCollectionId,
          index.key,
          IndexType.Key,
          index.attributes
        );
      }

      console.log('✅ Clients collection created successfully');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Clients collection already exists, checking attributes...');
        collectionExists = true;
      } else {
        throw error;
      }
    }

    // If collection exists, try to add missing attributes
    if (collectionExists) {
      await this.ensureClientsAttributes();
    }
  }

  async ensureClientsAttributes() {
    const attributes = [
      { key: 'clientName', type: 'string', size: 255, required: true },
      { key: 'username', type: 'string', size: 100, required: true },
      { key: 'password', type: 'string', size: 255, required: true },
      { key: 'websiteDomain', type: 'string', size: 255, required: true },
      { key: 'trackingId', type: 'string', size: 100, required: true },
      { key: 'googleAnalyticsPropertyId', type: 'string', size: 100, required: false },
      { key: 'isActive', type: 'boolean', required: true },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'lastLogin', type: 'datetime', required: false },
    ];

    for (const attr of attributes) {
      try {
        console.log(`  📝 Ensuring attribute: ${attr.key}...`);
        
        if (attr.type === 'string') {
          await this.databases.createStringAttribute(
            config.databaseId,
            config.clientsCollectionId,
            attr.key,
            attr.size || 255,
            attr.required
          );
        } else if (attr.type === 'boolean') {
          await this.databases.createBooleanAttribute(
            config.databaseId,
            config.clientsCollectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'datetime') {
          await this.databases.createDatetimeAttribute(
            config.databaseId,
            config.clientsCollectionId,
            attr.key,
            attr.required
          );
        }
        console.log(`    ✅ Added ${attr.key}`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`    ⚠️  Attribute ${attr.key} already exists`);
        } else {
          console.log(`    ❌ Failed to add ${attr.key}: ${error.message}`);
        }
      }
    }
  }

  async ensureAnalyticsAttributes() {
    const attributes = [
      { key: 'clientId', type: 'string', size: 100, required: true },
      { key: 'websiteDomain', type: 'string', size: 255, required: true },
      { key: 'pageViews', type: 'integer', required: true },
      { key: 'uniqueVisitors', type: 'integer', required: true },
      { key: 'sessionDuration', type: 'float', required: true },
      { key: 'bounceRate', type: 'float', required: true },
      { key: 'date', type: 'string', size: 20, required: true },
      { key: 'timestamp', type: 'datetime', required: true },
    ];

    for (const attr of attributes) {
      try {
        console.log(`  📝 Ensuring attribute: ${attr.key}...`);
        
        if (attr.type === 'string') {
          await this.databases.createStringAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.size || 255,
            attr.required
          );
        } else if (attr.type === 'integer') {
          await this.databases.createIntegerAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'float') {
          await this.databases.createFloatAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'datetime') {
          await this.databases.createDatetimeAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.required
          );
        }
        console.log(`    ✅ Added ${attr.key}`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`    ⚠️  Attribute ${attr.key} already exists`);
        } else {
          console.log(`    ❌ Failed to add ${attr.key}: ${error.message}`);
        }
      }
    }
  }

  async createAnalyticsCollection() {
    let collectionExists = false;
    
    try {
      console.log(`📊 Creating analytics collection: ${config.analyticsCollectionId}...`);
      
      // Create collection
      await this.databases.createCollection(
        config.databaseId,
        config.analyticsCollectionId,
        'Analytics Data',
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );

      // Create attributes (simplified to avoid size limits)
      const attributes = [
        { key: 'clientId', type: 'string', size: 100, required: true },
        { key: 'websiteDomain', type: 'string', size: 255, required: true },
        { key: 'pageViews', type: 'integer', required: true },
        { key: 'uniqueVisitors', type: 'integer', required: true },
        { key: 'sessionDuration', type: 'float', required: true },
        { key: 'bounceRate', type: 'float', required: true },
        { key: 'date', type: 'string', size: 20, required: true },
        { key: 'timestamp', type: 'datetime', required: true },
      ];

      for (const attr of attributes) {
        console.log(`  📝 Adding attribute: ${attr.key}...`);
        
        if (attr.type === 'string') {
          await this.databases.createStringAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.size || 255,
            attr.required
          );
        } else if (attr.type === 'integer') {
          await this.databases.createIntegerAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'float') {
          await this.databases.createFloatAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'datetime') {
          await this.databases.createDatetimeAttribute(
            config.databaseId,
            config.analyticsCollectionId,
            attr.key,
            attr.required
          );
        }
      }

      // Create indexes
      const indexes = [
        { key: 'client_index', attributes: ['clientId'] },
        { key: 'date_index', attributes: ['date'] },
        { key: 'domain_analytics_index', attributes: ['websiteDomain'] },
      ];

      for (const index of indexes) {
        console.log(`  🔍 Creating index: ${index.key}...`);
        await this.databases.createIndex(
          config.databaseId,
          config.analyticsCollectionId,
          index.key,
          IndexType.Key,
          index.attributes
        );
      }

      console.log('✅ Analytics collection created successfully');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Analytics collection already exists, checking attributes...');
        collectionExists = true;
      } else {
        throw error;
      }
    }

    // If collection exists, try to add missing attributes
    if (collectionExists) {
      await this.ensureAnalyticsAttributes();
    }
  }

  async run() {
    try {
      console.log('🚀 Starting Appwrite setup for Zeropoint Labs Dashboard...\n');
      
      await this.validateConfig();
      await this.createDatabase();
      await this.createClientsCollection();
      await this.createAnalyticsCollection();
      
      console.log('\n🎉 Appwrite setup completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Your database and collections are ready');
      console.log('   2. Start your dev server: npm run dev');
      console.log('   3. Test at: http://localhost:3000/add-client');
      console.log('   4. Check browser console for any connection issues');
      
    } catch (error: any) {
      console.error('\n❌ Setup failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Check your .env.local file has correct values');
      console.log('   2. Verify your Appwrite API key has correct permissions');
      console.log('   3. Ensure your project ID is correct');
      process.exit(1);
    }
  }
}

// Instructions for first-time users
function showInstructions() {
  console.log(`
🚀 Appwrite Automated Setup

📋 Prerequisites:
1. Create Appwrite project at https://cloud.appwrite.io
2. Generate an API key with Database permissions
3. Create .env.local file with:

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=zeropoint-dashboard
APPWRITE_CLIENTS_COLLECTION_ID=clients
APPWRITE_ANALYTICS_COLLECTION_ID=analytics

⚡ Then run: npm run setup:appwrite
`);
}

// Run setup - simplified execution
console.log('🔍 Debug info:');
console.log('  Project ID:', config.projectId ? '✅ Found' : '❌ Missing');
console.log('  API Key:', config.apiKey ? '✅ Found' : '❌ Missing');

if (!config.projectId || !config.apiKey) {
  showInstructions();
  process.exit(1);
}

new AppwriteSetup().run(); 