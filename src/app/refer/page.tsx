'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function Refer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              Earn $50 for Every Event You Refer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              If someone books a dinner, cocktail hour, or meal plan through your referral, you'll receive $50. Just share your custom link and we'll handle the rest.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-island-green text-white px-8 py-4 rounded-lg text-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Get Your Referral Link
            </button>
          </motion.div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              {showSuccess ? (
                <div className="text-center">
                  <h2 className="text-2xl font-serif text-gray-900 mb-4">Thanks!</h2>
                  <p className="text-gray-600 mb-6">
                    We'll email you your referral link soon.
                  </p>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setShowSuccess(false);
                    }}
                    className="bg-island-green text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">Get Your Referral Link</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-island-green text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </>
  );
} 