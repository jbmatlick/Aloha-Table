import { Auth0Config } from '@auth0/nextjs-auth0';

export const auth0Config: Auth0Config = {
  session: {
    rollingDuration: 60 * 15, // 15 minutes
    absoluteDuration: 60 * 60, // 1 hour
    autoSave: true,
  }
}; 