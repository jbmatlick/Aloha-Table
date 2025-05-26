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
            src="/images/iris.jpg"
            alt="Edwayris Oliveras"
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
              Meet Your Chef
            </motion.h1>
          </div>
        </div>

        {/* Chef Profile Section */}
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-md mb-8">
              <Image
                src="/images/iris.jpg"
                alt="Edwayris Oliveras"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Edwayris Oliveras</h2>
              <p className="text-xl text-island-green font-medium mb-6">Private Chef</p>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
Hello my name is Edwayris Oliveras, I'm a 21-year-old private chef based on the beautiful island of Kauai. My journey in the kitchen started as a little girl, side-by-side with my great-grandmother, learning how to cook with heart, intuition, and a deep respect for flavor. Today, that same love carries through everything I do—from intimate in-home dinners to thoughtful meal prep services tailored to individual tastes and dietary needs.

Though I've been cooking professionally for just over a year, the kitchen has always been my creative space. I specialize in high-quality, traditional meals with a homey feel—food that feels both comforting and elevated. I'm gluten-free myself, so I have a strong awareness around dietary preferences, but I never limit my menus to just one type of eater. Whether you're gluten-free, vegan, or an omnivore, there will always be something satisfying and delicious for you at the table.

What truly sets me apart is my ability to take any set of ingredients and transform them into something flavorful and nourishing. I don't believe in overcomplicating things—simple can be spectacular when the flavors are right. I'm known for creating meals that are approachable yet memorable, familiar yet full of personality.

Living on Kauai gives me the unique opportunity to source the freshest, most vibrant ingredients directly from local farmers markets. I love building menus that reflect the rhythm of the island—seasonal, colorful, and deeply connected to the land. Supporting local growers and incorporating just-picked produce adds another layer of meaning and freshness to everything I create.
In collaboration with a talented local sommelier, I also offer thoughtfully curated wine and spirit pairings that enhance the flavors of each dish. Whether it's a crisp white to accompany fresh seafood or a bold red that brings depth to a hearty entrée, our pairings are designed to elevate your entire dining experience.

For me, private cheffing is about more than just food—it's about people. I love building real relationships with my clients, curating meals that reflect their preferences and lifestyles. Every menu I create is personal, using fresh ingredients to deliver dishes that satisfy the body and soul.

Whether you're planning a special dinner or need consistent, thoughtful meal prep, I'm here to help you feel nourished, cared for, and happy with what you're eating.
              </p>
            </div>
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