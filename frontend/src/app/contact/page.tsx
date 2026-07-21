'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall, Mail, MapPin, Clock, CheckCircle2, ChevronDown, HelpCircle,
  AlertCircle, Sparkles, Building
} from 'lucide-react';
import { API_BASE } from '../../lib/clientState';

const faqs = [
  { q: 'What security protocols are active at HMR Hostel?', a: 'We employ trained security guards on 24x7 rotative shifts, biometric gate controls, continuous CCTV monitoring of common areas, and digital visitor registration systems.' },
  { q: 'Is laundry service included in the annual fees?', a: 'Yes! Washing and steam pressing twice a week is fully covered under the annual rental cost, with no separate charges.' },
  { q: 'How is room allocation managed?', a: 'Rooms and bed selections are managed dynamically. When students complete document uploads and process fee payments, their selected bed gets locked on the server immediately.' },
  { q: 'Are visitors/parents allowed inside the hostel rooms?', a: 'Parents are allowed in the visitor lounge and dining areas during visiting hours (10 AM - 6 PM). Overnight stays for parents require written clearance from the Warden Room.' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: 'Single Seater', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/bookings/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredCategory: formData.category,
          bookingProgress: `Contact Form: ${formData.message}`
        })
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', category: 'Single Seater', message: '' });
      } else {
        throw new Error('Failed to submit inquiry lead');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-soft min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Admissions Helpdesk 2026</span>
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-800 tracking-tight">Contact HMR Campus</h1>
          <p className="text-sm text-neutral-400 font-semibold leading-relaxed">
            Have questions about room selections, payments, or visiting schedules? Reach out to our admissions team.
          </p>
        </section>

        {/* Contact info grid & Map */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <h3 className="font-extrabold text-lg text-neutral-800">Campus Coordinates</h3>
              
              <div className="space-y-4 text-xs font-semibold text-neutral-500">
                <div className="flex items-center space-x-3">
                  <PhoneCall className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <div className="text-neutral-800 font-bold">Helpline (Admissions)</div>
                    <div className="text-neutral-400 mt-0.5">+91 99887 76655 • +91 99887 76644</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <div className="text-neutral-800 font-bold">Admissions Desk</div>
                    <div className="text-neutral-400 mt-0.5">admissions@hmrhostel.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <div className="text-neutral-800 font-bold">HMR Hostel Campus</div>
                    <div className="text-neutral-400 mt-0.5 leading-relaxed">Sector-62, Near University Main Gate, Delhi NCR, India</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <div className="text-neutral-800 font-bold">Visiting Hours</div>
                    <div className="text-neutral-400 mt-0.5">10:00 AM - 06:00 PM (Monday - Sunday)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Frame visual */}
            <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm overflow-hidden h-60 relative">
              <div className="absolute inset-0 bg-sky-50 flex items-center justify-center p-6 text-center">
                <div>
                  <Building className="w-8 h-8 text-secondary/70 mx-auto mb-2 animate-bounce" />
                  <span className="font-bold text-sm text-neutral-800 block">HMR Campus Site</span>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Delhi NCR Main Link Road, Sector-62</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Inquiry lead form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-xl text-neutral-800">Send an Inquiry</h3>
            <p className="text-xs text-neutral-400 font-semibold -mt-2">Queries submitted generate a live executive follow-up ticket.</p>
            
            {success ? (
              <div className="p-6 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-start space-x-3 animate-fade-in">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Query Submitted!</h4>
                  <p className="text-xs mt-1">Our support executive will follow up with you shortly on your registered phone number.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary text-xs text-neutral-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary text-xs text-neutral-800 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary text-xs text-neutral-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Sharing Choice</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary text-xs text-neutral-800 bg-white"
                    >
                      <option value="Single Seater">Single Seater</option>
                      <option value="2 Seater">2 Seater</option>
                      <option value="3 Seater">3 Seater</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Inquiry Message</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your questions..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary text-xs text-neutral-800 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-sm"
                >
                  {loading ? 'Submitting query...' : 'Send Admissions Enquiry'}
                </button>
              </form>
            )}
          </div>

        </section>

        {/* FAQs Accordion */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-extrabold text-2xl text-neutral-800">Quick Admissions FAQ</h3>
            <p className="text-xs text-neutral-400 font-bold">Have some quick questions? We have answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-200/50 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 font-bold text-left text-xs sm:text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="p-5 bg-neutral-50/50 border-t border-neutral-100 text-xs text-neutral-500 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
