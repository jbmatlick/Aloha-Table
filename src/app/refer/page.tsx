'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Image from 'next/image';

export default function ReferPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [referralLink, setReferralLink] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/referrers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create referrer');
      }

      // Use the referral URL from the API response
      setReferralLink(data.referralUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[600px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
            alt="Chef preparing food in a tropical setting"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-serif mb-6"
              >
                Earn $50 for Every Booked Event You Refer
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
              >
                If someone books a dinner, cocktail hour, or meal plan through your referral, you'll receive $50. Just share your custom link and we'll handle the rest.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-serif text-gray-900 mb-6">
                Get Your Referral Link
              </h2>
              <p className="text-gray-600 mb-8">
                Join our referral program and earn rewards for every successful booking you refer. We'll track all your referrals automatically.
              </p>

              {!referralLink ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-island-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-island-green focus:border-transparent"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-island-green text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Referral Link'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your Referral Link</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink);
                        }}
                        className="px-4 py-2 bg-island-green text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Share this link with your friends and family. When they book through your link, you'll earn $50 for every successful booking!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
} 