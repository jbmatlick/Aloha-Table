import { getSession } from '@auth0/nextjs-auth0';

console.log('Initializing Auth0 configuration...');

export const auth0Config = {
  session: {
    rollingDuration: 60 * 15, // 15 minutes
    absoluteDuration: 60 * 60, // 1 hour
    autoSave: true,
  }
};

console.log('Auth0 configuration initialized with session settings:', {
  rollingDuration: auth0Config.session.rollingDuration,
  absoluteDuration: auth0Config.session.absoluteDuration,
  autoSave: auth0Config.session.autoSave
}); 