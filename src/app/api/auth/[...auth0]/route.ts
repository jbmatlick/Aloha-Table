import { handleAuth } from '@auth0/nextjs-auth0';

console.log('Setting up Auth0 route handlers...');

const handler = handleAuth();

console.log('Auth0 handler created successfully');

export const GET = handler;
export const POST = handler; 