'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Twitter, Linkedin, Facebook } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const aboutUsLinks = ['About Us', 'Community', 'Scholarships', 'Investors', 'Notice Of EGM'];
  const otherLinks = ['Blogs', 'Terms and Conditions', 'Privacy Policy', 'Careers', 'Covid-19', 'Media'];
  const locationsList = [
    'Ahmedabad', 'Bengaluru', 'Dehradun', 'Delhi', 'Greater Noida', 'Gurgaon',
    'Indore', 'Jaipur', 'Mangalore', 'Mumbai', 'Nagpur', 'Noida', 'Pune', 'Raipur'
  ];

  return (
    <footer className="bg-white text-neutral-800 border-t border-neutral-200/80 pt-20 pb-10 px-6 sm:px-12 relative overflow-hidden">
      
      {/* Visual decorative accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-200/80">
        
        {/* About & Socials Column */}
        <div className="md:col-span-4 space-y-6">
          <Logo textColor="text-neutral-900" subColor="text-neutral-500" size="md" />
          
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-neutral-400 uppercase tracking-widest">Follow us for Insta-Worthy</h4>
            <p className="text-base sm:text-lg font-black text-accent tracking-tight">Hostel Havens & Epic Adventures</p>
          </div>
          
          <div className="flex space-x-3.5 pt-1">
            {[
              { icon: Instagram, name: 'Instagram', url: 'https://instagram.com' },
              { icon: Youtube, name: 'YouTube', url: 'https://youtube.com' },
              { icon: Twitter, name: 'Twitter', url: 'https://twitter.com' },
              { icon: Linkedin, name: 'LinkedIn', url: 'https://linkedin.com' },
              { icon: Facebook, name: 'Facebook', url: 'https://facebook.com' }
            ].map((soc, i) => {
              const Icon = soc.icon;
              return (
                <a
                  key={i}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  className="w-11 h-11 rounded-full bg-neutral-50 border border-neutral-200 hover:border-accent hover:bg-accent/10 text-neutral-600 hover:text-accent flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* ABOUT US Links Column */}
        <div className="md:col-span-2 space-y-5">
          <h4 className="text-sm font-black uppercase tracking-widest text-accent">ABOUT US</h4>
          <ul className="space-y-3 text-sm text-neutral-500 font-bold">
            {aboutUsLinks.map((link, i) => (
              <li key={i}>
                <Link href="#hero" className="hover:text-neutral-900 transition-colors duration-200">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* OTHER LINKS Column */}
        <div className="md:col-span-3 space-y-5">
          <h4 className="text-sm font-black uppercase tracking-widest text-accent">OTHER LINKS</h4>
          <ul className="space-y-3 text-sm text-neutral-500 font-bold">
            {otherLinks.map((link, i) => (
              <li key={i}>
                <Link href="#hero" className="hover:text-white transition-colors duration-200 hover:text-neutral-900">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LOCATIONS Column */}
        <div className="md:col-span-3 space-y-5">
          <h4 className="text-sm font-black uppercase tracking-widest text-accent">LOCATIONS</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-neutral-500 font-bold">
            {locationsList.map((loc, i) => (
              <Link key={i} href="#hero" className="hover:text-neutral-900 transition-colors duration-200">{loc}</Link>
            ))}
          </div>
        </div>

      </div>

      {/* Note & Bottom copyright bar */}
      <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400 font-bold gap-4">
        <div>
          © {new Date().getFullYear()} HMR Hostel. All rights reserved. Designed for Premium Student Living.
        </div>
        <div className="max-w-2xl text-center md:text-right text-[10px] leading-relaxed">
          Note: Images shown are for representational purposes only. Amenities depicted may or may not form a part of that individual property.
        </div>
      </div>
    </footer>
  );
}
