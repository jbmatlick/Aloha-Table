'use client';
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { useEffect } from 'react';

function LoginPage() {
  useEffect(() => {
    window.location.href = '/api/auth/login?returnTo=%2Fadmin';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-gray-900 mb-4">Redirecting to login...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the login page.</p>
      </div>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
} 