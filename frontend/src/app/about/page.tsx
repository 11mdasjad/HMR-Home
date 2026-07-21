'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Heart, Shield, Users, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const values = [
  { title: 'Safety First', desc: 'Continuous CCTV cameras and check-in registers ensure a secure home.', icon: Shield, color: 'text-secondary bg-secondary/10' },
  { title: 'Vibrant Community', desc: 'Collaborate and grow with peer students from across top colleges.', icon: Users, color: 'text-accent bg-accent/10' },
  { title: 'Hygienic Focus', desc: 'Daily room sanitization, deep cleaning, and strict mess inspections.', icon: Heart, color: 'text-pink-500 bg-pink-500/10' },
  { title: 'Academic Focus', desc: 'Quiet air-conditioned reading halls designed to support exams study.', icon: Compass, color: 'text-indigo-500 bg-indigo-500/10' }
];

const stats = [
  { value: '5+', label: 'Years of Excellence' },
  { value: '70', label: 'Premium Rooms' },
  { value: '500+', label: 'Happy Alumni Students' },
  { value: '100%', label: 'Safety Record' }
];

export default function AboutPage() {
  return (
    <div className="bg-primary-soft min-h-[80vh] py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-bold text-xs uppercase tracking-wider"
          >
            <Award className="w-4 h-4" />
            <span>Pioneering Premium Living</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-neutral-800 leading-tight"
          >
            About HMR Hostel
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed"
          >
            Dedicated to providing the safest, most comfortable, and focus-friendly residential environment for college students in Delhi NCR.
          </motion.p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm text-center space-y-1"
            >
              <div className="text-3xl font-extrabold text-secondary">{s.value}</div>
              <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </section>

        {/* Brand Mission & Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 leading-tight">
              Our Vision: Your Home Away From Home
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
              Founded with the singular goal of redefining student housing, HMR Hostel bridges the gap between structured campus dormitories and unpredictable rented apartments. We understand that a student needs more than just a bed to study and grow.
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
              We focus on premium support, healthy meal menus, high-speed connectivity, and rapid maintenance ticketing to let you channel 100% of your energy into your studies, sports, and personal development.
            </p>
            <div className="space-y-3">
              {[
                'Affiliated with top engineering and management colleges.',
                'Rigid anti-ragging policies and biometric gates checks.',
                'Eco-friendly solar backups and organic kitchen supplies.'
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-2.5 text-xs text-neutral-600 font-bold">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-md border border-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
              alt="HMR Hostel Living Common Lounge"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Our Pillars Values */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-neutral-800">Our Core Principles</h2>
            <p className="text-xs text-neutral-400 font-bold">The foundation of everything we build at HMR.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-start space-x-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${val.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-neutral-800 text-lg mb-1">{val.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-semibold">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Visit HMR Campus?</h2>
          <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Reserve a premium bed now. Smart bed selections are synced in real-time. Reach out to our admissions helpdesk today!
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/book" className="bg-secondary text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-secondary/20 hover:bg-secondary-dark">
              Book Bed Now
            </Link>
            <Link href="/contact" className="border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:bg-white/10">
              Get in Touch
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
