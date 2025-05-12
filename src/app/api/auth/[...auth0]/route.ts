import { handleAuth } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

console.log('Setting up Auth0 route handlers...');

const handleAuthWithLogging = () => {
  console.log('Creating Auth0 handler with logging...');
  
  const handler = handleAuth({
    async callback(req: NextRequest) {
      console.log('Auth0 callback initiated');
      try {
        const res = await handleAuth().callback(req);
        console.log('Auth0 callback successful');
        return res;
      } catch (error) {
        console.error('Auth0 callback failed:', error);
        return NextResponse.redirect(new URL('/login?error=Authentication failed', req.url));
      }
    },
    async login(req: NextRequest) {
      console.log('Auth0 login initiated');
      try {
        const res = await handleAuth().login(req);
        console.log('Auth0 login successful');
        return res;
      } catch (error) {
        console.error('Auth0 login failed:', error);
        return NextResponse.redirect(new URL('/login?error=Login failed', req.url));
      }
    },
    async logout(req: NextRequest) {
      console.log('Auth0 logout initiated');
      try {
        const res = await handleAuth().logout(req);
        console.log('Auth0 logout successful');
        return res;
      } catch (error) {
        console.error('Auth0 logout failed:', error);
        return NextResponse.redirect(new URL('/login?error=Logout failed', req.url));
      }
    }
  });

  console.log('Auth0 handler created successfully');
  return handler;
};

export const GET = handleAuthWithLogging();
export const POST = handleAuthWithLogging(); 