'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wifi, ShieldAlert, Coffee, Battery, RefreshCw, KeyRound, BookOpen,
  Dribbble, HeartHandshake, Zap, Trash, Clock, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const items = [
  {
    title: 'High-speed Fibernet Wi-Fi',
    desc: 'Dual-band Wi-Fi connection running up to 1 Gbps. Coverage extends throughout all residential corridors, study cabins, dining mess, and recreation rooms.',
    details: 'Individual logins • Mac-address filtering • Unlimited download caps',
    icon: Wifi,
    color: 'text-blue-600 bg-blue-50'
  },
  {
    title: 'Biometric Access Control',
    desc: 'Smart face-recognition and biometric entry logs secure the main access portals. Entry logs are automatically synced to guard rooms and parent notifications.',
    details: 'Biometric logs • Visitor clearance triggers • 24/7 gate security',
    icon: KeyRound,
    color: 'text-pink-600 bg-pink-50'
  },
  {
    title: 'Hygienic Dining & Mess',
    desc: 'Nutritious vegetarian and egg meals served four times daily. Formulated menus inspect nutrition count, seasonal vegetables, and kitchen hygiene standards.',
    details: 'Breakfast: 8 AM - 10 AM • Lunch: 1 PM - 3 PM • Evening Tea • Dinner: 8 PM - 10 PM',
    icon: Coffee,
    color: 'text-orange-600 bg-orange-50'
  },
  {
    title: 'Heavy Generator Power Backup',
    desc: 'Industrial-grade generators provide instant power back up during electrical outages, ensuring that lifts, lights, study lounges, and Wi-Fi stay operational.',
    details: 'Automatic ATS switcher • Solar-grid hybrid backup • 24x7 coverage',
    icon: Battery,
    color: 'text-yellow-600 bg-yellow-50'
  },
  {
    title: 'Commercial Laundry Support',
    desc: 'Commercial wash cycles and dry presses processed twice weekly. Individual clothes bags and steam iron configurations prevent mixing or fabric damage.',
    details: '2 washes per week • Steam iron included • Dynamic drop/collect timeline',
    icon: RefreshCw,
    color: 'text-purple-600 bg-purple-50'
  },
  {
    title: 'Quiet Study Lounge',
    desc: 'Air-conditioned study lounges equipped with individual charging sockets, ergonomics mesh chairs, and whiteboard grids to support collaborative student projects.',
    details: 'Open 24/7 • Dynamic whiteboards • Multi-socket tables',
    icon: BookOpen,
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    title: 'Equipped Exercise Gym',
    desc: 'Full wellness center loaded with running treadmills, cycle trainers, dumbbells, cross cables, yoga mats, and a sound system to support daily training.',
    details: 'Morning: 6 AM - 9 AM • Evening: 5 PM - 9 PM • Safety weights guidelines',
    icon: Dribbble,
    color: 'text-red-600 bg-red-50'
  },
  {
    title: '24/7 Medical Assistance',
    desc: 'Dedicated on-campus medical cabinets with standard first-aid. Tied-up hospital transport ambulance stands on-call just 5 minutes away from the main gates.',
    details: 'First-aid cabinet • On-call doctor consultation • Emergency vehicles tie-ups',
    icon: HeartHandshake,
    color: 'text-teal-600 bg-teal-50'
  },
  {
    title: 'Professional Housekeeping',
    desc: 'Routine daily cleaning of room spaces, bathrooms, corridors, and waste disposals managed by trained janitorial staff using advanced sanitization tools.',
    details: 'Daily trash clearance • Bi-weekly washroom sanitization • Common areas cleaning',
    icon: Trash,
    color: 'text-emerald-600 bg-emerald-50'
  }
];

export default function FacilitiesPage() {
  return (
    <div className="bg-primary-soft min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Info */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-bold text-xs uppercase tracking-wider"
          >
            <Zap className="w-4 h-4" />
            <span>Simplify Your Living</span>
          </motion.div>
          <h1 className="text-4xl font-extrabold text-neutral-800 tracking-tight">Hostel Facilities & Services</h1>
          <p className="text-sm text-neutral-400 font-semibold leading-relaxed">
            HMR Hostel offers custom-built amenities designed to eliminate daily logistics friction, letting students focus fully on their academic careers.
          </p>
        </section>

        {/* Facilities visual cards detailed list */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between hover:border-secondary/20 transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${item.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-neutral-800 text-lg sm:text-xl leading-tight">{item.title}</h3>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-start space-x-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <span>{item.details}</span>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Closing CTA Banner */}
        <section className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm text-center max-w-3xl mx-auto space-y-6">
          <h3 className="font-extrabold text-xl text-neutral-800">Experience Premium Hostel Living</h3>
          <p className="text-xs text-neutral-400 font-semibold max-w-md mx-auto">
            Bookings are fully digitized and live availability is updated in real-time. Secure your room category today.
          </p>
          <div>
            <Link href="/book" className="inline-block bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-sm">
              Start Booking Flow
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
