'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE, setAuthToken, setAuthUser, getAuthUser } from '../../lib/clientState';
import { Mail, Lock, User, Phone, CheckCircle2, ShieldAlert } from 'lucide-react';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const user = getAuthUser();
    if (user) {
      if (user.role === 'STUDENT') router.push('/student');
      else if (user.role === 'SUPER_ADMIN') router.push('/superadmin');
      else router.push('/admin');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setAuthToken(data.token);
      setAuthUser(data.user);

      setSuccess('Logged in successfully!');
      
      setTimeout(() => {
        if (data.user.role === 'STUDENT') {
          router.push('/student');
        } else if (data.user.role === 'SUPER_ADMIN') {
          router.push('/superadmin');
        } else {
          router.push('/admin');
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-6">
      <div className="glass-card rounded-3xl p-8 border border-white/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/25 to-secondary/25 rounded-bl-full -z-10" />

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 mb-8">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 ${isLogin ? 'border-secondary text-neutral-800' : 'border-transparent text-neutral-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 ${!isLogin ? 'border-secondary text-neutral-800' : 'border-transparent text-neutral-400'}`}
          >
            Create Account
          </button>
        </div>

        <div className="flex flex-col items-center mb-6 space-y-3">
          <Logo layout="vertical" size="sm" showText={false} />
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-neutral-800">
              {isLogin ? 'Welcome Back' : 'Join HMR Hostel'}
            </h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">
              {isLogin ? 'Log in with student or admin accounts.' : 'Sign up to start booking your room.'}
            </p>
          </div>
        </div>

        {/* Messaging Feedback */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-accent-light border border-accent/20 text-accent-dark rounded-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Details */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. email@domain.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-4 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {isLogin && (
          <div className="mt-6 text-center space-y-4">
            <span className="text-xs text-neutral-400 font-semibold block">Demo Accounts:</span>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setFormData({ name: '', email: 'admin@hmr.com', password: 'password123', phone: '' });
                  setIsLogin(true);
                }}
                className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-600 transition-all"
              >
                Use Admin Demo
              </button>
              <button
                onClick={() => {
                  setFormData({ name: '', email: 'superadmin@hmr.com', password: 'password123', phone: '' });
                  setIsLogin(true);
                }}
                className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-600 transition-all"
              >
                Use Super Admin Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
