'use client';

import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      
      {/* Referral Callout Section */}
      <section className="bg-[#f8f5f0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif text-gray-900 mb-4"
            >
              Know someone who might love Salt and Serenity?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              Refer a friend and earn $50 for every event they book.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/refer"
                className="inline-block bg-island-green text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Referring
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}