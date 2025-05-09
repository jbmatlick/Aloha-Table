import React from 'react'
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Salt and Serenity | Private Chef Services on Kauai',
  description: 'Elevating island dining with curated private chef experiences, wine tastings, and personalized meal plans',
  metadataBase: new URL('https://salt-and-serenity.com'),
  openGraph: {
    title: 'Salt and Serenity | Private Chef Services on Kauai',
    description: 'Elevating island dining with curated private chef experiences, wine tastings, and personalized meal plans',
    url: 'https://salt-and-serenity.com',
    siteName: 'Salt and Serenity',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Salt and Serenity Private Chef Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salt and Serenity | Private Chef Services on Kauai',
    description: 'Elevating island dining with curated private chef experiences, wine tastings, and personalized meal plans',
    images: ['/images/hero-bg.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
} 