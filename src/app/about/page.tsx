'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">About Me</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Passionate about creating unforgettable culinary experiences on the beautiful island of Kauai
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-1 w-full"
              >
                <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=2070&q=80"
                    alt="Professional chef preparing food in a modern kitchen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <div className="prose prose-lg">
                  <p className="text-gray-600 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="text-gray-600 mb-8">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-island-green text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Book Your Experience
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-island-green py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Let's Create Something Special Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              I'd love to hear about your vision for your next culinary experience
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-island-green px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
    </>
  );
} 