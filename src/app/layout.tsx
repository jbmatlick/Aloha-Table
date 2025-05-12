'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Salt and Serenity | Private Chef Services on Kauai</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className="bg-white text-gray-900 min-h-screen font-sans antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
} 