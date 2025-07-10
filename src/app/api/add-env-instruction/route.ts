import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Add this environment variable to Vercel:",
    instruction: {
      name: "NEXT_PUBLIC_APP_URL",
      value: "https://zeropoint-labs.com",
      note: "This should match your domain. Add it in Vercel Dashboard > Settings > Environment Variables"
    },
    steps: [
      "1. Go to Vercel Dashboard",
      "2. Select your project",
      "3. Go to Settings > Environment Variables",
      "4. Add: NEXT_PUBLIC_APP_URL = https://zeropoint-labs.com",
      "5. Set for all environments (Production, Preview, Development)",
      "6. Redeploy your project"
    ]
  });
} 