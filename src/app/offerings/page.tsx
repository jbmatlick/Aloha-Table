'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';

const offerings = [
  {
    title: 'Cocktail & Hors d\'oeuvres',
    description: 'Perfect for sunset hours — passed appetizers paired with curated wines. Ideal for relaxed gatherings or celebrations.',
    icon: '🍷',
  },
  {
    title: 'Meal Plans',
    description: 'Personalized weekly meals crafted with local, seasonal ingredients. Available for delivery or in-home preparation.',
    icon: '🥗',
  },
  {
    title: 'Private Dinners',
    description: 'Intimate, multi-course dinners prepared onsite — featuring Kauai-grown produce and fresh island flavors.',
    icon: '🍽️',
  },
];

const detailedOfferings = [
  {
    title: 'Cocktail & Hors d\'oeuvres',
    description: 'Perfect for golden-hour gatherings and intimate celebrations, this experience brings a curated selection of passed appetizers and wine pairings directly to your lanai or event space. Crafted with Kauai-grown ingredients, each bite is a conversation starter.',
    imagePosition: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=2070&q=80',
      alt: 'Elegant sunset cocktail party on a tropical lanai',
    },
  },
  {
    title: 'Meal Plans',
    description: 'Whether you\'re on vacation or living the island life, let us take care of your meals. Enjoy seasonal, health-focused meal plans tailored to your dietary needs — delivered fresh or prepared in your kitchen.',
    imagePosition: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=2070&q=80',
      alt: 'Modern island kitchen with fresh ingredients and prepared meals',
    },
  },
  {
    title: 'Private Dinners',
    description: 'Host an unforgettable evening featuring a multi-course menu inspired by the flavors of Kauai. From surf to turf to tropical fruits, your private chef experience includes planning, prep, plating, and cleanup — so you can relax and enjoy your guests.',
    imagePosition: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2070&q=80',
      alt: 'Elegant home dining room with modern table setting',
    },
  },
];

export default function Offerings() {
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
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">The Menu</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the finest culinary offerings on Kauai, crafted with local ingredients and personalized to your preferences
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offerings.map((offering, index) => (
                <motion.div
                  key={offering.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{offering.icon}</div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-4">{offering.title}</h2>
                  <p className="text-gray-600">{offering.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        {detailedOfferings.map((offering, index) => (
          <section
            key={offering.title}
            className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col ${offering.imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: offering.imagePosition === 'right' ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex-1"
                >
                  <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
                    {offering.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {offering.description}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block mt-8 bg-island-green text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Book This Experience
                  </Link>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: offering.imagePosition === 'right' ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 w-full"
                >
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={offering.image.src}
                      alt={offering.image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="bg-island-green py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Ready to Experience Island Table?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Let's create an unforgettable culinary experience tailored to your preferences
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-island-green px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
    </>
  );
} 