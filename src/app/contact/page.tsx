'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    adults: '',
    children: '',
    preferredDate: '',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-serif text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600">
              Let's create an unforgettable dining experience for you on Kauai
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-lg p-8"
            autoComplete="on"
          >
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              {/* Number of Adults */}
              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                  How many adults?
                </label>
                <input
                  type="number"
                  name="adults"
                  id="adults"
                  min="1"
                  required
                  value={formData.adults}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  inputMode="numeric"
                />
              </div>

              {/* Number of Children */}
              <div>
                <label htmlFor="children" className="block text-sm font-medium text-gray-700">
                  How many children under 12?
                </label>
                <input
                  type="number"
                  name="children"
                  id="children"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  inputMode="numeric"
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                  Preferred Date(s)
                </label>
                <input
                  type="text"
                  name="preferredDate"
                  id="preferredDate"
                  placeholder="e.g., June 15-20, 2024"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  autoComplete="off"
                />
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                  Additional Details / Questions
                </label>
                <textarea
                  name="details"
                  id="details"
                  rows={4}
                  value={formData.details}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-island-green focus:ring-island-green"
                  placeholder="Tell us about your event or any special requests..."
                  autoComplete="off"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-island-green text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </main>
    </>
  );
} 