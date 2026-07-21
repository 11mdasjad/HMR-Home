'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wifi, Shield, Compass, Coffee, Battery, RefreshCw, KeyRound, Dribbble,
  BookOpen, HeartHandshake, PhoneCall, ChevronDown, CheckCircle, ArrowRight,
  TrendingUp, Sparkles, Building, Check
} from 'lucide-react';

const stats = [
  { label: 'Total Rooms Available', value: '70 Rooms', icon: Building, color: 'text-secondary' },
  { label: 'Security Protocols', value: '24x7 Active', icon: Shield, color: 'text-accent' },
  { label: 'Wi-Fi Speed', value: '1 Gbps Fibernet', icon: Wifi, color: 'text-indigo-500' },
  { label: 'Power Backup', value: 'Instant Backup', icon: Battery, color: 'text-warning' }
];

const facilities = [
  { title: 'High-speed WiFi', desc: 'Secure 1Gbps fiber internet covers all corridors and study desks.', icon: Wifi, color: 'bg-blue-500/10 text-blue-600' },
  { title: '24x7 Security & CCTV', desc: 'Continuous camera surveillance and trained guards guard the premises.', icon: Shield, color: 'bg-emerald-500/10 text-emerald-600' },
  { title: 'Nutritious Mess', desc: '4-time hygienically cooked food served daily with seasonal menus.', icon: Coffee, color: 'bg-orange-500/10 text-orange-600' },
  { title: 'Power Backup', desc: 'Heavy load power generators deliver instant backup in power cuts.', icon: Battery, color: 'bg-yellow-500/10 text-yellow-600' },
  { title: 'Laundry Service', desc: 'Automatic commercial washers and dry-cleaning services twice a week.', icon: RefreshCw, color: 'bg-purple-500/10 text-purple-600' },
  { title: 'Biometric Entry', desc: 'Strict fingerprint/facial check-in entry gates secure entry logs.', icon: KeyRound, color: 'bg-pink-500/10 text-pink-600' },
  { title: 'Co-working Study Rooms', desc: 'Air-conditioned quiet cabins with sockets for focused studies.', icon: BookOpen, color: 'bg-indigo-500/10 text-indigo-600' },
  { title: 'Fully Loaded Gym', desc: 'Equipped with treadmills, free weights, and cross trainers.', icon: Dribbble, color: 'bg-red-500/10 text-red-600' },
  { title: 'Medical Support', desc: 'First-aid kit and tied-up hospital ambulances 5 minutes away.', icon: HeartHandshake, color: 'bg-teal-500/10 text-teal-600' }
];

const roomsData = [
  { name: 'Single Seater', price: '₹1.60 Lakh', desc: 'Perfect for maximum privacy, complete with an attached bath and a private study desk.', spaces: '20 Rooms', tags: ['Attached Bathroom', '1 Bed', 'Premium Cupboard'] },
  { name: '2 Seater', price: '₹1.40 Lakh', desc: 'A spacious double sharing room balancing privacy and collaborative student living.', spaces: '20 Rooms', tags: ['Attached Bathroom', '2 Beds', 'Duo Wardrobes'] },
  { name: '3 Seater', price: '₹1.25 Lakh', desc: 'Affordable triple occupancy rooms designed with optimal seating arrangements.', spaces: '30 Rooms', tags: ['Attached Bathroom', '3 Beds', 'Individual Drawers'] }
];

const faqs = [
  { q: 'How does the smart room selection work?', a: 'During booking, you can choose your room tier (1, 2, or 3 sharing), inspect available rooms, select your specific room number, and choose your exact bed layout in real-time.' },
  { q: 'Is there a booking verification process?', a: 'Yes. Once you complete document uploads and process the payments, our administrators inspect the credentials (ID cards/Aadhar details) and change your booking status to approved.' },
  { q: 'Can I cancel my hostel booking?', a: 'Cancellations can be made within 7 days of reservation. Full refunds are processed directly back to original UPI/Card accounts.' },
  { q: 'What is the support desk response time?', a: 'All complaints logged on student dashboards are pushed in real-time to admin terminals. Cleaning and electricity issues are resolved within 2-4 hours.' }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', category: 'Single Seater' });
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone) return;
    
    try {
      const res = await fetch('http://localhost:5001/api/bookings/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          preferredCategory: inquiryForm.category,
          bookingProgress: 'Homepage Inquiry'
        })
      });
      if (res.ok) {
        setSubmittedInquiry(true);
        setInquiryForm({ name: '', email: '', phone: '', category: 'Single Seater' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-primary-soft">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Modern Student Living Experience</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-800 leading-tight tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">HMR Hostel</span>
            </h1>
            
            <p className="text-lg text-neutral-500 font-medium leading-relaxed max-w-xl">
              Safe • Affordable • Comfortable Living. Experience premium accommodation featuring air-conditioned rooms, healthy organic dining, co-working study lounges, and high-speed Wi-Fi designed to support your academic success.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/book" className="flex items-center space-x-2 bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-secondary/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 group">
                <span>Book Your Room</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/rooms" className="flex items-center space-x-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 px-8 py-4 rounded-2xl font-bold hover:shadow-md transition-all">
                <span>View Rooms</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Interactive Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
            
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-white/60">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-bl-full -z-10" />
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Live Inventory Status</span>
                <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Real-Time Sync</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/70 rounded-2xl border border-neutral-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">3S</div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-800">3 Seater (Triple Occupancy)</h4>
                      <p className="text-xs text-neutral-400">Perfect for flatmates</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">Only 2 left!</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/70 rounded-2xl border border-neutral-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">2S</div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-800">2 Seater (Double Sharing)</h4>
                      <p className="text-xs text-neutral-400">Balanced sharing</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">12 Available</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/70 rounded-2xl border border-neutral-100 hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">1S</div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-800">Single Seater (Private Room)</h4>
                      <p className="text-xs text-neutral-400">Total private space</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">5 Available</span>
                </div>
              </div>

              <div className="mt-8 border-t border-neutral-100 pt-6 flex items-center justify-between text-neutral-500">
                <span className="text-xs font-medium">Pricing starting from</span>
                <span className="text-lg font-extrabold text-neutral-800">₹1.25 Lakh<span className="text-xs font-medium text-neutral-400">/annum</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white py-12 border-y border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, index) => {
            const Icon = s.icon;
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl bg-neutral-50 ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral-800">{s.value}</div>
                  <div className="text-xs text-neutral-400 font-medium">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="facilities">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight">
            Premium Amenities For Exceptional Living
          </h2>
          <p className="text-neutral-400 font-medium text-sm md:text-base">
            HMR Hostel offers custom-built infrastructure catering to both safety and personal development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, i) => {
            const Icon = fac.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white p-6 rounded-2xl border border-neutral-100 hover:border-secondary/20 shadow-sm transition-all"
              >
                <div className={`p-3 rounded-xl inline-block mb-4 ${fac.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-800 mb-2">{fac.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{fac.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Room Listing Preview Section */}
      <section className="py-24 bg-white border-y border-neutral-200/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight">
                Our Room Categories
              </h2>
              <p className="text-neutral-400 font-medium text-sm md:text-base">
                Select from single sharing for complete study focus or shared rooms to experience college life.
              </p>
            </div>
            <Link href="/rooms" className="flex items-center space-x-2 text-secondary font-bold hover:text-secondary-dark transition-colors group">
              <span>Compare Room Details</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roomsData.map((room, idx) => (
              <div key={idx} className="border border-neutral-100 bg-primary-soft rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-extrabold text-xl text-neutral-800">{room.name}</h3>
                      <span className="text-xs text-neutral-400 font-bold">{room.spaces} Available</span>
                    </div>
                    <span className="text-2xl font-extrabold text-secondary">{room.price}<span className="text-xs font-semibold text-neutral-400">/annum</span></span>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6">{room.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {room.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs bg-white text-neutral-600 px-3 py-1 rounded-full border border-neutral-100 font-semibold">{tag}</span>
                    ))}
                  </div>
                </div>

                <Link href="/book" className="text-center bg-white hover:bg-secondary hover:text-white border border-neutral-200 text-neutral-700 font-bold py-3 rounded-2xl transition-all shadow-sm">
                  Choose Sharing
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Masonry Gallery */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight">
            Our Hostel Gallery
          </h2>
          <p className="text-neutral-400 font-medium text-sm md:text-base">
            Catch a glimpse of the premium living rooms, hygienic dining mess, gym, and landscaped garden.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop" alt="Premium Room" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop" alt="Sharing room" className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop" alt="Single Seater" className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop" alt="Gym room" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop" alt="Study room" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop" alt="Reception desk" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 bg-white border-t border-neutral-200/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-neutral-400 font-medium text-sm">Everything you need to know about room allocations and hostel terms.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 bg-primary-soft hover:bg-neutral-50 font-bold text-left text-neutral-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="p-6 bg-white border-t border-neutral-100 text-sm text-neutral-500 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Inquiry and Map Section */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Inquiry Form */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Get in Touch</h2>
              <p className="text-neutral-400 font-medium text-sm">Submit your query to trigger our automatic customer support line.</p>
            </div>

            {submittedInquiry ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-6 rounded-2xl flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Query Saved Successfully!</h4>
                  <p className="text-xs mt-1">Our support executive will reach out to you within 30 minutes. An automated SMS ticket has been logged.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Preferred Room Type</label>
                    <select
                      value={inquiryForm.category}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                    >
                      <option value="Single Seater">Single Seater</option>
                      <option value="2 Seater">2 Seater</option>
                      <option value="3 Seater">3 Seater</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-4 rounded-xl transition-all shadow-sm">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Maps placeholder */}
          <div className="lg:col-span-6 space-y-8 lg:pl-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Location & Contact</h2>
              <p className="text-neutral-400 font-medium text-sm">HMR Hostel is located strategically close to prime universities.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3">
                <PhoneCall className="w-5 h-5 text-secondary" />
                <div>
                  <div className="font-bold text-sm text-neutral-800">Support Line / WhatsApp</div>
                  <div className="text-xs text-neutral-500">+91 99887 76655 (24/7 Helpline)</div>
                </div>
              </div>

              <div className="h-48 w-full bg-neutral-100 rounded-2xl overflow-hidden relative border border-neutral-200/50">
                {/* Mock map visual */}
                <div className="absolute inset-0 bg-sky-50 flex items-center justify-center text-center p-4">
                  <div>
                    <Building className="w-8 h-8 text-secondary/70 mx-auto mb-2" />
                    <span className="font-bold text-sm text-neutral-800 block">HMR Hostel Campus</span>
                    <span className="text-xs text-neutral-400">Sector-62, Near University Main Gate, Delhi NCR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
