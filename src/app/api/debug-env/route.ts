import { NextResponse } from 'next/server';

export async function GET() {
  // Only log non-sensitive variables, or redact secrets before logging!
  console.log('AUTH0_SECRET:', process.env.AUTH0_SECRET ? 'SET' : 'NOT SET');
  console.log('AUTH0_BASE_URL:', process.env.AUTH0_BASE_URL);
  console.log('AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL);
  console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID);
  console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'NOT SET');
  console.log('TEST_VAR:', process.env.TEST_VAR);
  return NextResponse.json({
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'NOT SET',
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_SECRET: process.env.AUTH0_SECRET ? 'SET' : 'NOT SET',
  });
}
  