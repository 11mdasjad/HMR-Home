'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthUser, clearAuth } from '../lib/clientState';
import { Home, Bed, User, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Sync session on mount & pathname change
    setUser(getAuthUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-neutral-200/50 backdrop-blur-md px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive('/') ? 'text-secondary font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}>
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link href="/rooms" className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive('/rooms') ? 'text-secondary font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}>
            <Bed className="w-4 h-4" />
            <span>Rooms</span>
          </Link>

          <Link href="/facilities" className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive('/facilities') ? 'text-secondary font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}>
            <span>Facilities</span>
          </Link>

          <Link href="/about" className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive('/about') ? 'text-secondary font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}>
            <span>About</span>
          </Link>

          <Link href="/contact" className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive('/contact') ? 'text-secondary font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}>
            <span>Contact</span>
          </Link>

          <Link href="/book" className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isActive('/book') ? 'text-secondary font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}>
            <User className="w-4 h-4" />
            <span>Book Hostel</span>
          </Link>
        </div>

        {/* Portal CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-500 font-medium hidden lg:inline">Hi, {user.name}</span>
              {user.role === 'STUDENT' ? (
                <Link href="/student" className="flex items-center space-x-1 text-sm font-medium bg-secondary/10 text-secondary px-4 py-2 rounded-xl hover:bg-secondary/20 transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Student Panel</span>
                </Link>
              ) : (
                <Link href={user.role === 'SUPER_ADMIN' ? '/superadmin' : '/admin'} className="flex items-center space-x-1 text-sm font-medium bg-accent/10 text-accent-dark px-4 py-2 rounded-xl hover:bg-accent/20 transition-all">
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center space-x-1 text-sm font-medium border border-danger-light text-danger bg-danger/5 px-4 py-2 rounded-xl hover:bg-danger hover:text-white transition-all">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 px-4 py-2">
                Sign In
              </Link>
              <Link href="/book" className="text-sm font-semibold bg-secondary hover:bg-secondary-dark text-white px-5 py-2.5 rounded-xl shadow-sm transform hover:-translate-y-0.5 transition-all">
                Book Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-all">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-neutral-100 flex flex-col space-y-4 animate-fade-in">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive('/') ? 'bg-secondary/5 text-secondary' : 'text-neutral-600'}`}>
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Home</span>
          </Link>
          <Link href="/rooms" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive('/rooms') ? 'bg-secondary/5 text-secondary' : 'text-neutral-600'}`}>
            <Bed className="w-5 h-5" />
            <span className="font-medium text-sm">Rooms</span>
          </Link>
          <Link href="/facilities" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive('/facilities') ? 'bg-secondary/5 text-secondary' : 'text-neutral-600'}`}>
            <span className="font-medium text-sm pl-7">Facilities</span>
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive('/about') ? 'bg-secondary/5 text-secondary' : 'text-neutral-600'}`}>
            <span className="font-medium text-sm pl-7">About</span>
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive('/contact') ? 'bg-secondary/5 text-secondary' : 'text-neutral-600'}`}>
            <span className="font-medium text-sm pl-7">Contact</span>
          </Link>
          <Link href="/book" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2 p-2 rounded-lg ${isActive('/book') ? 'bg-secondary/5 text-secondary' : 'text-neutral-600'}`}>
            <User className="w-5 h-5" />
            <span className="font-medium text-sm">Book Hostel</span>
          </Link>

          <div className="border-t border-neutral-100 pt-4 flex flex-col space-y-3">
            {user ? (
              <>
                <div className="text-xs text-neutral-400 px-2 font-medium">Logged in as {user.name} ({user.role})</div>
                {user.role === 'STUDENT' ? (
                  <Link href="/student" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 p-2 bg-secondary/5 text-secondary rounded-lg">
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium text-sm">Student Dashboard</span>
                  </Link>
                ) : (
                  <Link href={user.role === 'SUPER_ADMIN' ? '/superadmin' : '/admin'} onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 p-2 bg-accent/5 text-accent rounded-lg">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium text-sm">Admin Dashboard</span>
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 p-2 border border-danger-light bg-danger/5 text-danger rounded-lg text-left">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 py-2 rounded-lg text-sm">
                  Sign In
                </Link>
                <Link href="/book" onClick={() => setMobileMenuOpen(false)} className="text-center font-medium bg-secondary text-white py-2 rounded-lg text-sm shadow-sm">
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
