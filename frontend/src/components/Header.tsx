'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Search, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import Logo from './Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi');

  const citiesList = [
    'Delhi', 'Noida', 'Greater Noida', 'Bengaluru', 'Pune', 'Mumbai', 'Ahmedabad', 'Jaipur', 'Indore', 'Raipur', 'Gurgaon', 'Dehradun'
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200/60 shadow-sm py-3.5 text-neutral-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Left Side: Logo & City Dropdown */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          
          {/* Responsive Logo: smaller on mobile, larger on desktop */}
          <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
            <div className="md:hidden">
              <Logo showText={true} textColor="text-neutral-900" subColor="text-neutral-400" size="sm" />
            </div>
            <div className="hidden md:block">
              <Logo showText={true} textColor="text-neutral-900" subColor="text-neutral-400" size="md" />
            </div>
          </Link>
          
          {/* City Selection Dropdown (Enlarged) */}
          <div className="relative hidden md:block border-l border-neutral-300 pl-6 sm:pl-8">
            <label className="block text-xs text-neutral-400 font-bold uppercase tracking-widest">Select Your</label>
            <div className="flex items-center space-x-2 cursor-pointer text-base sm:text-lg font-black text-neutral-800 hover:text-accent transition-colors mt-0.5">
              <span>{selectedCity}</span>
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            </div>
            
            {/* Simple dropdown overlay trigger (select) */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                // Dispatch event to filter page content if needed
                const event = new CustomEvent('city-change', { detail: e.target.value });
                window.dispatchEvent(event);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              {citiesList.map((city, i) => (
                <option key={i} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Search Box (Enlarged & Wider) */}
        <div className="hidden lg:flex items-center flex-grow max-w-xl relative">
          <input
            type="text"
            placeholder="Search your location..."
            className="w-full px-6 py-3 pl-6 pr-12 rounded-full border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:border-accent text-neutral-800 font-bold placeholder-neutral-400"
            onChange={(e) => {
              const event = new CustomEvent('location-search', { detail: e.target.value });
              window.dispatchEvent(event);
            }}
          />
          <Search className="w-5 h-5 text-neutral-400 absolute right-5 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Right Side: Contact, WhatsApp & Menu Toggle (Enlarged / Responsive) */}
        <div className="flex items-center space-x-3.5 sm:space-x-6 flex-shrink-0">
          {/* WhatsApp logo / link */}
          <a
            href="https://wa.me/918383027664"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base font-black text-[#25D366] hover:text-[#20ba5a] transition-colors"
          >
            <FaWhatsapp className="w-6 h-6" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Call Us button: Circular icon-only on mobile, full text button on desktop */}
          <a
            href="tel:+918383027664"
            className="flex items-center justify-center text-sm sm:text-base font-black text-accent border-2 border-accent hover:bg-accent hover:text-white p-2.5 sm:px-6 sm:py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
            aria-label="Call Us"
          >
            <Phone className="w-4.5 h-4.5" />
            <span className="hidden sm:inline ml-1.5">Call Us</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7.5 h-7.5 text-neutral-800" />
            ) : (
              <Menu className="w-7.5 h-7.5 text-neutral-800" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[76px] bg-white z-40 p-8 border-t border-neutral-100 flex flex-col justify-between animate-fade-in">
          <div className="flex flex-col space-y-6">
            
            {/* Search Input for Mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search your location..."
                className="w-full px-5 py-4 pl-5 pr-12 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none font-bold"
                onChange={(e) => {
                  const event = new CustomEvent('location-search', { detail: e.target.value });
                  window.dispatchEvent(event);
                }}
              />
              <Search className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Mobile links */}
            <div className="flex flex-col space-y-5">
              <Link href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">Home</Link>
              <Link href="#amenities" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">Amenities</Link>
              <Link href="#cities" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">Top Cities</Link>
              <Link href="#colleges" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">Nearby Colleges</Link>
              <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">Reviews</Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">FAQs</Link>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-black uppercase tracking-wider text-neutral-800 hover:text-accent">Contact</Link>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 flex flex-col space-y-4">
            <a
              href="https://wa.me/918383027664"
              className="flex items-center justify-center space-x-2 text-base font-black bg-[#25D366] text-white py-4 rounded-xl"
            >
              <span>WhatsApp Us</span>
            </a>
            <a
              href="tel:+918383027664"
              className="flex items-center justify-center space-x-2 text-base font-black bg-accent text-white py-4 rounded-xl"
            >
              <Phone className="w-5 h-5" />
              <span>Call +91 83830 27664</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
