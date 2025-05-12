// @ts-ignore
import { handleAuth } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const GET = handleAuth({
  session: {
    rollingDuration: 60 * 15, // 15 minutes
    absoluteDuration: 60 * 60, // 1 hour
    autoSave: true,
  }
});

export const POST = handleAuth();

export const GET_EDGE = handleAuth({
  callback: async (req: NextRequest, ctx: any) => {
    try {
      const res = await handleAuth().callback(req, ctx);
      return res;
    } catch (error) {
      console.error('Auth0 callback error:', error);
      return NextResponse.redirect(new URL('/login?error=Authentication failed', req.url));
    }
  },
  login: async (req: NextRequest, ctx: any) => {
    try {
      const res = await handleAuth().login(req, ctx);
      return res;
    } catch (error) {
      console.error('Auth0 login error:', error);
      return NextResponse.redirect(new URL('/login?error=Login failed', req.url));
    }
  },
  logout: async (req: NextRequest, ctx: any) => {
    try {
      const res = await handleAuth().logout(req, ctx);
      return res;
    } catch (error) {
      console.error('Auth0 logout error:', error);
      return NextResponse.redirect(new URL('/login?error=Logout failed', req.url));
    }
  }
}); 