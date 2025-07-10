# 📊 Zeropoint Labs Analytics Dashboard

Professional client analytics dashboard built with Next.js, integrating Google Analytics 4 API and Appwrite for multi-client website analytics management.

## 🚀 Features

- **Multi-Client Support** - Manage unlimited clients with isolated dashboards
- **Real Google Analytics Data** - Direct GA4 API integration with live metrics
- **Client Authentication** - Secure login system with client-specific access
- **Professional Dashboard** - Beautiful, responsive analytics interface
- **Real-time Updates** - Live data fetching with refresh capabilities
- **Complete Admin Panel** - Easy client creation and management
- **Vercel Ready** - Optimized for seamless cloud deployment

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Appwrite Database
- **Analytics**: Google Analytics 4 Data API
- **Authentication**: Appwrite Auth + Custom Session Management
- **UI Components**: Radix UI, Framer Motion
- **Deployment**: Vercel, Environment Variables

## 📋 Prerequisites

- Node.js 18+
- Google Cloud Console access
- Appwrite account
- Google Analytics 4 properties for clients

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/zero-point-labs/zeropoint-labs-GA4.git
cd zeropoint-labs-GA4
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### 3. Google Analytics Setup
1. Create service account in Google Cloud Console
2. Download credentials JSON file
3. Add service account email to GA4 properties as "Viewer"
4. Place credentials file as `google-analytics-credentials.json`

### 4. Appwrite Setup
```bash
npm run setup:appwrite
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### For Administrators

1. **Add New Client**: Visit `/add-client`
   - Fill client information and GA4 Property ID
   - Copy generated credentials and tracking script
   - Install tracking script on client's website

2. **Client Management**: Use Appwrite console for user management

### For Clients

1. **Access Dashboard**: Visit `/login`
   - Use provided username/password
   - View real-time analytics data
   - Monitor website performance

## 📚 Documentation

- [Client Setup Guide](./CLIENT_SETUP_GUIDE.md) - Complete client onboarding process
- [Quick Reference](./QUICK_REFERENCE.md) - 5-minute setup checklist  
- [Deployment Guide](./DEPLOYMENT.md) - Vercel deployment instructions

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository**: Import project in Vercel Dashboard
2. **Set Environment Variables**: Configure in Vercel settings
3. **Deploy**: Automatic build and deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Environment Variables Required

```bash
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

# Google Analytics
GOOGLE_APPLICATION_CREDENTIALS=./google-analytics-credentials.json
GOOGLE_ANALYTICS_PROPERTY_ID=default-property-id

# For Production (Vercel)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PROJECT_ID=your-google-project-id
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   └── analytics/     # GA4 integration
│   ├── dashboard/         # Client dashboard
│   ├── login/             # Authentication
│   └── add-client/        # Admin panel
├── components/            # Reusable UI components
│   ├── ui/               # Base components
│   ├── sections/         # Page sections
│   └── layout/           # Layout components
├── lib/                   # Utilities & services
│   ├── google-analytics.ts # GA4 service
│   ├── appwrite.ts       # Database service
│   └── auth.ts           # Authentication
└── blocks/               # UI blocks
```

## 🔧 API Endpoints

- `GET /api/health` - System health check
- `GET /api/analytics` - Fetch analytics data
- `GET /api/analytics/test` - Test GA4 connection
- Support for `clientId` and `propertyId` parameters

## 🧪 Testing

```bash
# Test GA4 connection
curl "http://localhost:3000/api/analytics/test?propertyId=PROPERTY_ID"

# Test client analytics  
curl "http://localhost:3000/api/analytics?clientId=CLIENT_ID"

# Health check
curl "http://localhost:3000/api/health"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check guides in repository
- **Issues**: Create GitHub issue for bugs
- **Questions**: Contact [support@zeropointlabs.com](mailto:support@zeropointlabs.com)

---

**Built with ❤️ by Zero Point Labs** - Professional web development solutions in Cyprus 