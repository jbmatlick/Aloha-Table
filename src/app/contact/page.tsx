'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    adults: '',
    children: '',
    preferredDate: '',
    details: '',
    preferredContact: '',
    referrerId: ''
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      console.log('Referral ID found:', ref);
      setFormData(prev => ({ ...prev, referrerId: ref }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          preferredDate: formData.preferredDate,
          contactMethod: formData.preferredContact,
          message: formData.details,
          referrerId: formData.referrerId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.',
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          adults: '',
          children: '',
          preferredDate: '',
          details: '',
          preferredContact: '',
          referrerId: ''
        });
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070"
            alt="Chef preparing food"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-serif text-center mb-4"
            >
              Let's Get Cooking!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-center max-w-2xl"
            >
              Tell us about your event or ideal meal plan — and we'll take it from there.
            </motion.p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading...</div>}>
            {status.type === 'success' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#f8f5f0] rounded-2xl p-8 md:p-12 shadow-xl"
              >
                <div className="max-w-xl mx-auto text-center">
                  <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                      alt="Chef preparing food"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-serif text-gray-900 mb-4"
                  >
                    Thanks! We'll Be in Touch Soon.
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-gray-600 mb-8"
                  >
                    We can't wait to hear what you're planning. We'll get back to you within 24 hours.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="inline-block bg-island-green text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-emerald-700"
                  >
                    <Link href="/">
                      Return Home
                    </Link>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-2xl p-8 md:p-12"
                autoComplete="on"
              >
                {status.type === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 rounded-lg bg-red-50 text-red-800 shadow-md"
                  >
                    {status.message}
                  </motion.div>
                )}

                {/* Hidden referrer ID field */}
                {formData.referrerId && (
                  <input
                    type="hidden"
                    name="referrerId"
                    value={formData.referrerId}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      autoComplete="name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>

                  {/* Number of Adults */}
                  <div>
                    <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                      How many adults?
                    </label>
                    <input
                      type="number"
                      name="adults"
                      id="adults"
                      min="1"
                      value={formData.adults}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      inputMode="numeric"
                    />
                  </div>

                  {/* Number of Children */}
                  <div>
                    <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
                      How many children under 12?
                    </label>
                    <input
                      type="number"
                      name="children"
                      id="children"
                      min="0"
                      value={formData.children}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      inputMode="numeric"
                    />
                  </div>

                  {/* Preferred Date */}
                  <div className="md:col-span-2">
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date(s) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="preferredDate"
                      id="preferredDate"
                      required
                      placeholder="e.g., June 15-20, 2024"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      autoComplete="off"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How would you like us to contact you? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <label className="inline-flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="Email Me"
                          required
                          checked={formData.preferredContact === 'Email Me'}
                          onChange={handleChange}
                          className="h-4 w-4 text-island-green focus:ring-island-green border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Email Me</span>
                      </label>
                      <label className="inline-flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="Text Me"
                          required
                          checked={formData.preferredContact === 'Text Me'}
                          onChange={handleChange}
                          className="h-4 w-4 text-island-green focus:ring-island-green border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Text Me</span>
                      </label>
                      <label className="inline-flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="Call Me"
                          required
                          checked={formData.preferredContact === 'Call Me'}
                          onChange={handleChange}
                          className="h-4 w-4 text-island-green focus:ring-island-green border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Call Me</span>
                      </label>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="md:col-span-2">
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Details / Questions <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="details"
                      id="details"
                      rows={4}
                      required
                      value={formData.details}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                      placeholder="Tell us about your event or any special requests..."
                      autoComplete="off"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-island-green text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-emerald-700'
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </Suspense>
        </div>
      </main>
    </>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070"
            alt="Chef preparing food"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-serif text-center mb-4"
            >
              Let's Get Cooking!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-center max-w-2xl"
            >
              Tell us about your event or ideal meal plan — and we'll take it from there.
            </motion.p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </main>
    </>
  );
} 