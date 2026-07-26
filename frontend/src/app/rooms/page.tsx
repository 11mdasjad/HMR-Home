'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bed, Wifi, Compass, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface RoomType {
  id: string;
  category: string;
  price: string;
  spaces: string;
  desc: string;
  features: string[];
  image: string;
  amenities: string[];
}

const mockRooms: RoomType[] = [
  {
    id: 'single-seater',
    category: 'Single Seater',
    price: '₹1.60 Lakh',
    spaces: '20 Rooms Available',
    desc: 'Indulge in ultimate privacy and deep study focus with our single occupancy premium rooms, complete with modern attached baths, modular wardrobes, and a private study desk.',
    features: ['Attached Bathroom', '1 Bed', 'Premium Cupboard', 'Balcony Access'],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop',
    amenities: ['High-Speed WiFi', 'Biometric Lock', 'AC', 'Housekeeping', 'Study Table']
  },
  {
    id: 'double-seater',
    category: '2 Seater',
    price: '₹1.40 Lakh',
    spaces: '35 Rooms Available',
    desc: 'Collaborate and share your college experience in our spacious double sharing rooms, perfectly optimized to give each resident their own space, locker, and workstation.',
    features: ['Attached Bathroom', '2 Beds', 'Duo Wardrobes', 'Balcony Access'],
    image: '/images/hero_room.png',
    amenities: ['High-Speed WiFi', 'AC', 'Housekeeping', 'Duo Study Tables', 'Biometric Access']
  },
  {
    id: 'triple-seater',
    category: '3 Seater',
    price: '₹1.25 Lakh',
    spaces: '40 Rooms Available',
    desc: 'Experience vibrant community student living with our affordable triple occupancy rooms. Meticulously designed layouts maximize room space without compromising individual privacy.',
    features: ['Attached Bathroom', '3 Beds', 'Individual Drawers', 'Balcony Access'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop',
    amenities: ['High-Speed WiFi', 'AC', 'Housekeeping', 'Shared study lounge access', 'CCTV Security']
  }
];

export default function RoomsPage() {
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredRooms = filterCategory === 'All'
    ? mockRooms
    : mockRooms.filter(r => r.category === filterCategory);

  return (
    <div className="bg-primary-soft min-h-screen pt-32 pb-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-black text-xs uppercase tracking-wider">
            <Bed className="w-4 h-4 text-secondary" />
            <span>Luxurious Room Tiers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-800 tracking-tight">
            Our Room Categories
          </h1>
          <p className="text-base text-neutral-400 font-bold leading-relaxed">
            Select from single occupancy for complete academic focus, or shared options to experience a collaborative student community. All listings are static marketing representations.
          </p>
        </section>

        {/* Filters Panel */}
        <div className="flex justify-center gap-3">
          {['All', 'Single Seater', '2 Seater', '3 Seater'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-black transition-all duration-300 ${
                filterCategory === cat
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105'
                  : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/55'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room, idx) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-[32px] border border-neutral-100 hover:border-secondary/25 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Room Image */}
              <div className="relative h-64 bg-neutral-100 overflow-hidden group">
                <img
                  src={room.image}
                  alt={room.category}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-neutral-800 uppercase tracking-wider shadow-sm">
                  {room.spaces}
                </div>
                <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-wider shadow-md">
                  Premium
                </div>
              </div>

              {/* Room Details */}
              <div className="p-8 sm:p-10 space-y-6 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-3xl text-neutral-800">{room.category}</h3>
                    <p className="text-xs text-neutral-400 font-extrabold uppercase mt-1">Student Living</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-secondary">{room.price}</span>
                    <span className="text-xs text-neutral-400 font-bold block">/annum</span>
                  </div>
                </div>

                <p className="text-base text-neutral-500 leading-relaxed font-bold">
                  {room.desc}
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {room.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-xs font-extrabold bg-neutral-50 border border-neutral-200/50 text-neutral-600 px-3.5 py-1.5 rounded-full flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5 text-accent mr-1 flex-shrink-0" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Amenities checklist */}
                <div className="border-t border-neutral-100 pt-6">
                  <h4 className="text-sm font-black uppercase tracking-wider text-neutral-800 mb-3">Included Utilities:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm font-bold text-neutral-500">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-accent" />
                      <span>Attached Bath</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4.5 h-4.5 text-accent" />
                      <span>High-Speed WiFi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4.5 h-4.5 text-accent" />
                      <span>AC Rooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4.5 h-4.5 text-accent" />
                      <span>Locker & Desk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book CTA */}
              <div className="p-8 pt-0">
                <Link
                  href="/#inquiry"
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-black py-4.5 rounded-2xl text-center text-sm transition-all shadow-md shadow-secondary/10 flex items-center justify-center space-x-2"
                >
                  <span>Select {room.category} Sharing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </section>

      </div>
    </div>
  );
}
