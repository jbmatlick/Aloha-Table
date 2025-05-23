'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar = () => {
  const { user, error, isLoading } = useUser();
  console.log('[Navbar] user:', user);
  console.log('[Navbar] error:', error);
  console.log('[Navbar] isLoading:', isLoading);
  if (typeof window !== 'undefined') {
    console.log('[Navbar] window.location.href:', window.location.href);
    console.log('[Navbar] cookies:', document.cookie);
  }
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'The Menu', href: '/offerings' },
    { name: 'Contact', href: '/contact' },
    { name: 'Refer & Earn', href: '/refer' },
  ];

  if (error) {
    console.error('Auth0 user error:', error);
  }

  // Admin/session bar for logged-in users
  const sessionBar = user ? (
    <div style={{ width: '100%', background: '#111', color: '#fff', padding: '6px 0', textAlign: 'center', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
      <span style={{ marginRight: 16 }}>Logged in as <b>{user.email}</b></span>
      <a href="/admin" style={{ color: '#10b981', textDecoration: 'underline', marginRight: 16 }}>Admin Dashboard</a>
      <a href="/api/auth/logout" style={{ color: '#fff', textDecoration: 'underline' }}>Logout</a>
    </div>
  ) : null;

  return (
    <>
      {sessionBar}
      {/* Offset for the session bar */}
      <div style={{ height: user ? 38 : 0 }} />
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-serif text-island-green">
                Salt and Serenity
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-island-green transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {isLoading ? (
                <span className="text-gray-600">Loading...</span>
              ) : user ? (
                <a
                  href="/api/auth/logout"
                  className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/api/auth/logout';
                  }}
                >
                  Logout
                </a>
              ) : (
                <Link
                  href="/login?returnTo=/admin"
                  className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                >
                  Login
                </Link>
              )}
              <Link
                href="/contact"
                className="bg-island-green text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Get in Touch
              </Link>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isLoading ? (
              <span className="block px-3 py-2 text-gray-600">Loading...</span>
            ) : user ? (
              <a
                href="/api/auth/logout"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/api/auth/logout';
                  setIsOpen(false);
                }}
              >
                Logout
              </a>
            ) : (
              <Link
                href="/login?returnTo=/admin"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
            <Link
              href="/contact"
              className="block px-3 py-2 bg-island-green text-white rounded-md hover:bg-emerald-700"
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar; 