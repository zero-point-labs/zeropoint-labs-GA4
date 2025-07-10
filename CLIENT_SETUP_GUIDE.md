# 📊 Client Setup Guide - Zeropoint Labs Analytics Dashboard

Complete step-by-step guide for adding new clients to your analytics dashboard system.

## 🚀 Quick Overview

For each new client, you'll need to:
1. **Create Google Analytics 4 Property** for their website
2. **Add Service Account** to the GA4 property
3. **Create Client Account** in your dashboard
4. **Install Tracking Code** on their website
5. **Verify Data Flow** in the dashboard

---

## 📋 Prerequisites

- ✅ Zeropoint Labs Analytics Dashboard running
- ✅ Google Cloud Console access
- ✅ Service Account: `zeropoint@zeropoint-labs-analytics.iam.gserviceaccount.com`
- ✅ Credentials file: `google-analytics-credentials.json`

---

## 🎯 Step 1: Create Google Analytics 4 Property

### 1.1 Access Google Analytics
1. Go to [Google Analytics](https://analytics.google.com)
2. Click **"Create Account"** or use existing account
3. Click **"Create Property"**

### 1.2 Property Setup
1. **Property Name**: `[Client Name] - [Domain]`
   - Example: `GP Realty Cyprus - gprealty-cy.com`
2. **Reporting Time Zone**: Client's timezone
3. **Currency**: Client's currency
4. **Industry Category**: Select appropriate category
5. **Business Size**: Select client's business size

### 1.3 Data Stream Setup
1. Choose **"Web"** as platform
2. **Website URL**: `https://client-domain.com`
3. **Stream Name**: `[Client Name] Website`
4. Click **"Create Stream"**

### 1.4 Get Property ID
1. After creation, note the **Property ID** (e.g., `496317630`)
2. You'll need this for the client dashboard setup

---

## 🔐 Step 2: Grant Service Account Access

### 2.1 Access Property Settings
1. In Google Analytics, go to **"Admin"** (gear icon)
2. Select the property you just created
3. Click **"Property Access Management"**

### 2.2 Add Service Account
1. Click **"+"** → **"Add Users"**
2. **Email**: `zeropoint@zeropoint-labs-analytics.iam.gserviceaccount.com`
3. **Role**: Select **"Viewer"**
4. **Notify new users via email**: ❌ Uncheck (it's a service account)
5. Click **"Add"**

⚠️ **Critical**: Without this step, the dashboard cannot access the client's analytics data.

---

## 👤 Step 3: Create Client Account

### 3.1 Access Client Creation
1. Navigate to: `http://localhost:3000/add-client` (or your domain)
2. Fill in the client information form

### 3.2 Client Information
```
Client Name: [Full business name]
Username: [lowercase, no spaces, unique]
Password: [Generate secure password]
Website Domain: [domain.com - no https://]
Google Analytics Property ID: [Property ID from Step 1.4]
```

### 3.3 Example Form Data
```
Client Name: GP Realty Cyprus
Username: gprealty
Password: SecurePass123!
Website Domain: gprealty-cy.com
Google Analytics Property ID: 496317630
```

### 3.4 Save Client Credentials
⚠️ **Important**: Copy and securely store:
- Username
- Password
- Tracking ID (generated automatically)
- Tracking Script (for website integration)

---

## 🌐 Step 4: Install Tracking Code

### 4.1 Get Tracking Script
After creating the client, you'll receive a custom tracking script:

```html
<!-- Zeropoint Labs Analytics Tracking -->
<script>
(function() {
    const trackingId = 'zp_[unique-id]';
    const domain = 'client-domain.com';
    
    // Custom tracking code
    // [Full script provided in dashboard]
})();
</script>
```

### 4.2 Installation Methods

#### Option A: Header Installation (Recommended)
1. Add the script to the `<head>` section of all pages
2. Place before closing `</head>` tag
3. Ensure it loads on every page

#### Option B: Google Tag Manager
1. Create new **Custom HTML** tag
2. Paste the tracking script
3. Set trigger to **"All Pages"**
4. Publish the container

#### Option C: WordPress Plugin
1. Use **"Insert Headers and Footers"** plugin
2. Paste script in **"Scripts in Header"**
3. Save changes

### 4.3 Verify Installation
1. Visit client's website
2. Open browser developer tools
3. Check **Network** tab for tracking requests
4. Look for requests to your analytics server

---

## ✅ Step 5: Verify Data Flow

### 5.1 Test Analytics Connection
1. Go to: `http://localhost:3000/api/analytics/test?propertyId=[PROPERTY_ID]`
2. Should return: `{"success":true,"connected":true,...}`

### 5.2 Test Client Login
1. Navigate to: `http://localhost:3000/login`
2. Use client credentials from Step 3.4
3. Verify dashboard loads successfully

### 5.3 Check Real Data
1. Client dashboard should show analytics data
2. Initial data may take 24-48 hours to appear
3. Real-time data should appear within minutes

---

## 🔄 Step 6: Client Handover

### 6.1 Provide Client Credentials
Send to client securely:
```
Dashboard Login:
URL: https://yourdomain.com/login
Username: [username]
Password: [password]

Your analytics dashboard is ready! 
Visit the URL above to view your website analytics.
```

### 6.2 Training (Optional)
- Schedule brief demo session
- Show key metrics and features
- Explain data refresh timing
- Provide contact for support

---

## 🛠️ Troubleshooting

### ❌ "No Google Analytics Property ID configured"
- **Solution**: Add Property ID in add-client form
- **Check**: Client record in database has Property ID

### ❌ "Google Analytics connection failed"
- **Solution**: Verify service account has "Viewer" access
- **Check**: Property ID is correct and accessible

### ❌ "Client not found" 
- **Solution**: Verify client was created successfully
- **Check**: Username spelling and case sensitivity

### ❌ No analytics data showing
- **Solution**: Wait 24-48 hours for initial data
- **Check**: Tracking code installed correctly on website
- **Verify**: Website has actual visitors

### 🔍 Debug Commands
```bash
# Test specific Property ID
curl "http://localhost:3000/api/analytics/test?propertyId=PROPERTY_ID"

# Test with client ID  
curl "http://localhost:3000/api/analytics/test?clientId=CLIENT_ID"

# Check analytics API
curl "http://localhost:3000/api/analytics?propertyId=PROPERTY_ID"
```

---

## 📝 Client Onboarding Checklist

### Pre-Setup
- [ ] Client website domain confirmed
- [ ] Client business information collected
- [ ] Google Analytics account access confirmed

### Google Analytics Setup
- [ ] GA4 Property created
- [ ] Property ID documented
- [ ] Service account added with Viewer access
- [ ] Data stream configured

### Dashboard Setup
- [ ] Client account created
- [ ] Credentials saved securely
- [ ] Tracking script generated
- [ ] Connection test successful

### Website Integration
- [ ] Tracking code installed
- [ ] Installation verified
- [ ] Test data flowing

### Client Handover
- [ ] Login credentials provided
- [ ] Dashboard demo completed
- [ ] Client can access dashboard
- [ ] Analytics data visible

### Follow-up (24-48 hours)
- [ ] Real analytics data appearing
- [ ] Client satisfied with dashboard
- [ ] Any questions/issues resolved

---

## 📞 Support

For technical issues or questions:
- **Technical Support**: [your-email@zeropointlabs.com]
- **Dashboard Issues**: Check server logs and API responses
- **Google Analytics Issues**: Verify service account permissions

---

## 🔧 Advanced Configuration

### Multiple Domains for One Client
If client has multiple websites:
1. Create separate GA4 properties for each domain
2. Create separate client accounts with different Property IDs
3. Install tracking on each domain separately

### Custom Date Ranges
The dashboard supports custom date ranges via API:
```javascript
// Custom 30-day range
fetch('/api/analytics?clientId=CLIENT_ID&startDate=30daysAgo&endDate=today')

// Specific date range
fetch('/api/analytics?clientId=CLIENT_ID&startDate=2024-01-01&endDate=2024-01-31')
```

### Real-time Data
For real-time visitor tracking, the system automatically fetches:
- Active users
- Current page views
- Live visitor locations

---

**🎉 Congratulations!** Your client now has a fully functional analytics dashboard with real Google Analytics data! 