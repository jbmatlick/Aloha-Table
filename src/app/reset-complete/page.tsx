'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function ResetComplete() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login?returnTo=/admin&prompt=login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-gray-900 mb-4">Password Changed Successfully</h1>
            <p className="text-gray-600 mb-2">For security reasons, please log in with your new password.</p>
            <p className="text-gray-500 text-sm">Redirecting you to the login page...</p>
          </div>
        </div>
      </main>
    </>
  );
} 