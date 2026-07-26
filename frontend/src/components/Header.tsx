'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Search, ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi');

  const citiesList = [
    'Delhi', 'Noida', 'Greater Noida', 'Bengaluru', 'Pune', 'Mumbai', 'Ahmedabad', 'Jaipur', 'Indore', 'Raipur', 'Gurgaon', 'Dehradun'
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200/60 shadow-sm py-4 text-neutral-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between gap-6">
        
        {/* Left Side: Logo & City Dropdown */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
            <Logo showText={true} textColor="text-neutral-900" subColor="text-neutral-400" size="md" />
          </Link>
          
          {/* City Selection Dropdown (Enlarged) */}
          <div className="relative hidden md:block border-l border-neutral-300 pl-8">
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

        {/* Right Side: Contact, WhatsApp & Menu Toggle (Enlarged) */}
        <div className="flex items-center space-x-5 sm:space-x-8 flex-shrink-0">
          {/* WhatsApp logo / link */}
          <a
            href="https://wa.me/918383027664"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-base font-black text-[#25D366] hover:text-[#20ba5a] transition-colors"
          >
            <svg
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.794-4.382 9.797-9.77.001-2.586-1.007-5.017-2.839-6.85C16.326 2.15 13.902 1.14 11.31 1.14c-5.412 0-9.803 4.385-9.806 9.771-.001 2.012.529 3.98 1.533 5.707L2.03 20.737l4.617-1.583zm12.51-7.141c-.322-.162-1.905-.941-2.2-.1.096-.298-.242-.444-.322-.607-.081-.162-.081-.278-.041-.394.04-.116.162-.278.242-.394.081-.116.11-.194.162-.324.053-.13.025-.246-.014-.362-.039-.116-.322-.779-.442-1.069-.118-.283-.238-.245-.323-.25-.083-.005-.178-.006-.273-.006-.096 0-.251.036-.383.18-.132.145-.504.493-.504 1.203 0 .71.517 1.396.589 1.492.072.096 1.018 1.554 2.467 2.18.345.149.614.238.824.305.347.11.663.095.913.057.279-.041.905-.37 1.033-.728.129-.356.129-.663.09-.728-.039-.065-.145-.162-.468-.324z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Call Us button */}
          <a
            href="tel:+918383027664"
            className="flex items-center space-x-2 text-base font-black text-accent border-2 border-accent hover:bg-accent hover:text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5" />
            <span>Call Us</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-8 h-8 text-neutral-800" />
            ) : (
              <Menu className="w-8 h-8 text-neutral-800" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[88px] bg-white z-40 p-8 border-t border-neutral-100 flex flex-col justify-between animate-fade-in">
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
