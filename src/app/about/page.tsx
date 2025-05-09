'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] w-full">
          <Image
            src="/images/chefs-back-to-back.jpg"
            alt="Angie and Iris Oliveras"
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
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-center mb-4"
            >
              Meet the Chefs Behind Salt & Serenity
            </motion.h1>
          </div>
        </div>

        {/* Chef Profiles Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            {/* Back-to-back image */}
            <div className="relative w-full h-[600px] mb-16 rounded-lg overflow-hidden shadow-md">
              <Image
                src="/images/chefs-back-to-back.jpg"
                alt="Angie and Iris Oliveras"
                fill
                className="object-cover"
              />
            </div>

            {/* Bios side by side */}
            <div className="grid grid-cols-2 gap-16">
              {/* Angie's Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-left"
              >
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Angie Oliveras</h2>
                <p className="text-xl text-island-green font-medium mb-6">The Salt</p>
                <p className="text-gray-600 leading-relaxed">
                  I cook the way Kauai feels at sunset — warm, bold, and a little wild. My flavors are loud, honest, and rooted in the local land. After years spent working in busy kitchens from LA to Oahu, I came home to bring fire back to the plate — grilled pineapple, seared ahi, citrus marinades kissed by sea breeze. I love cooking barefoot, where the sound of the surf meets the sizzle of a hot pan. Salt isn't just a seasoning — it's an attitude.
                </p>
              </motion.div>

              {/* Iris's Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-left"
              >
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Iris Oliveras</h2>
                <p className="text-xl text-island-green font-medium mb-6">The Serenity</p>
                <p className="text-gray-600 leading-relaxed">
                  For me, cooking is meditation. It's the rustle of ti leaves, the calm of ocean air moving through open windows, and the soft perfume of poached mango in the afternoon light. I focus on nourishment that's elegant and unfussy — subtle, seasonal, and grounded in aloha. I've studied traditional Hawaiian ingredients and modern plant-forward cuisine to bring peaceful balance to every meal. I'm the yin to Angie's yang — the breeze after the heat.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-16">
            {/* Angie's Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-md mb-8">
                <Image
                  src="/images/angie.jpg"
                  alt="Angie Oliveras"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Angie Oliveras</h2>
                <p className="text-xl text-island-green font-medium mb-6">The Salt</p>
                <p className="text-gray-600 leading-relaxed">
                  I cook the way Kauai feels at sunset — warm, bold, and a little wild. My flavors are loud, honest, and rooted in the local land. After years spent working in busy kitchens from LA to Oahu, I came home to bring fire back to the plate — grilled pineapple, seared ahi, citrus marinades kissed by sea breeze. I love cooking barefoot, where the sound of the surf meets the sizzle of a hot pan. Salt isn't just a seasoning — it's an attitude.
                </p>
              </div>
            </motion.div>

            {/* Iris's Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-md mb-8">
                <Image
                  src="/images/iris.jpg"
                  alt="Iris Oliveras"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Iris Oliveras</h2>
                <p className="text-xl text-island-green font-medium mb-6">The Serenity</p>
                <p className="text-gray-600 leading-relaxed">
                  For me, cooking is meditation. It's the rustle of ti leaves, the calm of ocean air moving through open windows, and the soft perfume of poached mango in the afternoon light. I focus on nourishment that's elegant and unfussy — subtle, seasonal, and grounded in aloha. I've studied traditional Hawaiian ingredients and modern plant-forward cuisine to bring peaceful balance to every meal. I'm the yin to Angie's yang — the breeze after the heat.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lifestyle Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative h-[70vh] w-full"
        >
          <Image
            src="/images/kitchen-beach.jpg"
            alt="Cooking on the beach"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl md:text-2xl font-serif text-center px-4">
              A shared love of food, home, and the island
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
} 