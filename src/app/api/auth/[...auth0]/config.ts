import { getSession } from '@auth0/nextjs-auth0';

console.log('Initializing Auth0 configuration...');

if (!process.env.AUTH0_CLIENT_ID) {
  throw new Error('AUTH0_CLIENT_ID is required');
}

if (!process.env.AUTH0_CLIENT_SECRET) {
  throw new Error('AUTH0_CLIENT_SECRET is required');
}

if (!process.env.AUTH0_ISSUER_BASE_URL) {
  throw new Error('AUTH0_ISSUER_BASE_URL is required');
}

if (!process.env.AUTH0_BASE_URL) {
  throw new Error('AUTH0_BASE_URL is required');
}

if (!process.env.AUTH0_SECRET) {
  throw new Error('AUTH0_SECRET is required');
}

export const auth0Config = {
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  secret: process.env.AUTH0_SECRET,
  session: {
    rollingDuration: 60 * 15, // 15 minutes
    absoluteDuration: 60 * 60, // 1 hour
    autoSave: true,
  }
};

console.log('Auth0 configuration initialized with settings:', {
  clientID: 'SET',
  clientSecret: 'SET',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  secret: 'SET',
  session: auth0Config.session
}); 