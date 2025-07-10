# 🚀 Quick Reference - New Client Setup

## Essential Information

**Service Account Email**: `zeropoint@zeropoint-labs-analytics.iam.gserviceaccount.com`  
**Credentials File**: `google-analytics-credentials.json`  
**Add Client URL**: `http://localhost:3000/add-client`  
**Test API**: `http://localhost:3000/api/analytics/test?propertyId=PROPERTY_ID`

---

## 5-Minute Setup Process

### 1. Google Analytics (2 min)
```
→ Create GA4 Property for client
→ Get Property ID (e.g., 496317630)
→ Add service account with "Viewer" role
```

### 2. Dashboard Setup (1 min)
```
→ Go to /add-client
→ Fill form with Property ID
→ Save credentials + tracking script
```

### 3. Website Integration (2 min)
```
→ Add tracking script to <head>
→ Test with developer tools
→ Verify in dashboard
```

---

## Copy-Paste Templates

### Client Form Template
```
Client Name: [Business Name]
Username: [lowercase-unique]
Password: [Generated secure password]
Website Domain: [domain.com]
Google Analytics Property ID: [From GA4]
```

### Service Account Addition
```
Email: zeropoint@zeropoint-labs-analytics.iam.gserviceaccount.com
Role: Viewer
Notify: ❌ Uncheck
```

### Client Handover Message
```
🎉 Your analytics dashboard is ready!

Login: https://yourdomain.com/login
Username: [username]
Password: [password]

Your website analytics will appear within 24-48 hours.
```

---

## Quick Troubleshoot

| Error | Fix |
|-------|-----|
| "Property ID not configured" | Add Property ID in client form |
| "Connection failed" | Add service account to GA4 property |
| "No data showing" | Wait 24-48h or check tracking installation |

---

## Test Commands
```bash
# Test Property ID
curl "http://localhost:3000/api/analytics/test?propertyId=PROPERTY_ID"

# Test Client
curl "http://localhost:3000/api/analytics/test?clientId=CLIENT_ID"
``` 