# 🚀 Vercel Deployment Guide

Complete guide for deploying the Zeropoint Labs Analytics Dashboard to Vercel.

## 📋 Prerequisites

- ✅ GitHub repository with your code
- ✅ Vercel account
- ✅ Appwrite project set up
- ✅ Google Cloud service account created
- ✅ Google Analytics credentials

---

## 🔧 Step 1: Prepare Google Analytics for Production

### Option A: Environment Variables (Recommended)
Instead of using a credentials file, use environment variables for production:

1. **Get your service account key**:
   - Go to Google Cloud Console
   - Navigate to IAM & Admin > Service Accounts
   - Find your service account
   - Click "Keys" → "Add Key" → "Create New Key"
   - Choose JSON format and download

2. **Extract key information**:
   Open the downloaded JSON file and note:
   - `private_key` (the long string with `-----BEGIN PRIVATE KEY-----`)
   - `client_email` 
   - `project_id`

### Option B: Credentials File (Alternative)
If you prefer using the credentials file approach, you'll need to modify the Google Analytics service to read from environment variables.

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `zero-point-labs/zeropoint-labs-GA4`
4. Vercel will auto-detect it's a Next.js project

### 2.2 Configure Environment Variables
In the Vercel deployment settings, add these environment variables:

#### Appwrite Configuration
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-appwrite-project-id
APPWRITE_API_KEY=your-appwrite-api-key-with-database-permissions
APPWRITE_DATABASE_ID=zeropoint-dashboard
APPWRITE_CLIENTS_COLLECTION_ID=clients
APPWRITE_ANALYTICS_COLLECTION_ID=analytics
```

#### Google Analytics Configuration (Option A - Recommended)
```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_ANALYTICS_PROPERTY_ID=your-default-property-id
```

⚠️ **Important**: For the private key, make sure to:
- Include the quotes
- Include `\n` for line breaks
- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts

#### Optional Variables
```
ADMIN_ACCESS_TOKEN=your-admin-token-for-admin-features
```

### 2.3 Deploy
1. Click **"Deploy"**
2. Vercel will build and deploy your application
3. You'll get a deployment URL like `https://your-app.vercel.app`

---

## 🔄 Step 3: Update Google Analytics Service (If Using Environment Variables)

If you chose Option A, you need to update the Google Analytics service to read from environment variables instead of the credentials file.

### Update `src/lib/google-analytics.ts`:

```typescript
// Replace the constructor in GoogleAnalyticsService class
constructor(propertyId?: string) {
  // For production/Vercel deployment
  if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
    this.client = new BetaAnalyticsDataClient({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        project_id: process.env.GOOGLE_PROJECT_ID,
      },
    });
  } else {
    // For local development
    this.client = new BetaAnalyticsDataClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  // Use provided propertyId or fall back to environment variable
  this.propertyId = propertyId || process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '';
  
  if (!this.propertyId) {
    throw new Error('Property ID is required - either provide it as a parameter or set GOOGLE_ANALYTICS_PROPERTY_ID environment variable');
  }
}
```

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Basic Functionality
1. Visit your Vercel deployment URL
2. Navigate to `/api/health` to check if the API is working
3. Test the add-client page: `/add-client`

### 4.2 Test Analytics Connection
1. Visit: `https://your-app.vercel.app/api/analytics/test?propertyId=YOUR_PROPERTY_ID`
2. Should return successful connection response

### 4.3 Test Client Dashboard
1. Create a test client with a valid Property ID
2. Login with the test credentials
3. Verify the dashboard loads with analytics data

---

## 🔧 Step 5: Configure Custom Domain (Optional)

### 5.1 Add Domain in Vercel
1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `analytics.zeropointlabs.com`)

### 5.2 Configure DNS
1. Add CNAME record pointing to `cname.vercel-dns.com`
2. Or add A records pointing to Vercel's IP addresses

### 5.3 Update Client URLs
Update your client setup documentation to use the custom domain instead of the Vercel URL.

---

## 🛠️ Troubleshooting

### ❌ Build Errors
**Error**: `Module not found`
- **Solution**: Ensure all dependencies are in `package.json`
- **Check**: Run `npm install` locally to verify

### ❌ Environment Variables Not Working
**Error**: Environment variables undefined
- **Solution**: Redeploy after adding environment variables
- **Check**: Variables are added in Vercel dashboard, not just locally

### ❌ Google Analytics Connection Failed
**Error**: `Could not load credentials`
- **Solution**: Verify `GOOGLE_PRIVATE_KEY` format includes `\n` line breaks
- **Check**: Service account has proper permissions

### ❌ Appwrite Connection Failed
**Error**: Appwrite API errors
- **Solution**: Verify API key has Database permissions
- **Check**: Appwrite project ID and endpoint are correct

### 🔍 Debug Commands
```bash
# Check environment variables in Vercel
vercel env ls

# Test API endpoints
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/analytics/test?propertyId=PROPERTY_ID
```

---

## 📚 Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Appwrite Documentation](https://appwrite.io/docs)

---

## 🔒 Security Best Practices

1. **Never commit credentials** to your repository
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Use least privilege access** for service accounts
5. **Monitor API usage** in Google Cloud Console
6. **Set up proper CORS** if needed for API access

---

**🎉 Your analytics dashboard is now live on Vercel!** 

Users can access their dashboards at `https://your-domain.com/login` and admins can add new clients at `https://your-domain.com/add-client`. 