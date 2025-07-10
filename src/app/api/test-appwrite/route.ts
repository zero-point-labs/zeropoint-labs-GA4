import { NextResponse } from 'next/server';
import { Client, Databases, Account } from 'node-appwrite';

export async function GET() {
  try {
    // Initialize Appwrite client
    const client = new Client();
    client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
      .setKey(process.env.APPWRITE_API_KEY || '');

    const databases = new Databases(client);
    const account = new Account(client);

    // Test database connectivity
    let databaseTest = 'FAILED';
    try {
      await databases.list();
      databaseTest = 'SUCCESS';
    } catch (dbError: any) {
      databaseTest = `FAILED: ${dbError.message}`;
    }

    // Test specific database and collection access
    let collectionTest = 'FAILED';
    try {
      await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID || 'zeropoint-dashboard',
        process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'clients'
      );
      collectionTest = 'SUCCESS';
    } catch (collError: any) {
      collectionTest = `FAILED: ${collError.message}`;
    }

    return NextResponse.json({
      success: true,
      tests: {
        environment: {
          endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'NOT_SET',
          projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'NOT_SET',
          hasApiKey: !!process.env.APPWRITE_API_KEY,
          databaseId: process.env.APPWRITE_DATABASE_ID || 'NOT_SET',
          clientsCollectionId: process.env.APPWRITE_CLIENTS_COLLECTION_ID || 'NOT_SET',
        },
        connectivity: {
          database: databaseTest,
          clientsCollection: collectionTest,
        }
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Appwrite test failed', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 