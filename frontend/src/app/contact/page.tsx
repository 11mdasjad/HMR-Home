'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  PhoneCall, Mail, MapPin, Clock, CheckCircle2, Building, Sparkles
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email ID' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be exactly 10 digits' }),
  message: z.string().min(5, { message: 'Message must be at least 5 characters' }),
});

type ContactFormInput = z.infer<typeof contactSchema>;

const faqs = [
  { q: 'What security protocols are active at HMR Hostel?', a: 'We employ trained security guards on 24x7 rotative shifts, biometric gate controls, continuous CCTV monitoring of common areas, and digital visitor registration systems.' },
  { q: 'Is laundry service included in the annual fees?', a: 'Yes! Washing and steam pressing twice a week is fully covered under the annual rental cost, with no separate charges.' },
  { q: 'How is room allocation managed?', a: 'Rooms and bed selections are managed dynamically. When students complete document uploads and process fee payments, their selected bed gets locked on the server immediately.' },
  { q: 'Are visitors/parents allowed inside the hostel rooms?', a: 'Parents are allowed in the visitor lounge and dining areas during visiting hours (10 AM - 6 PM). Overnight stays for parents require written clearance from the Warden Room.' }
];

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormInput) => {
    console.log('Contact form inquiry:', data);
    setSuccess(true);
    reset();
  };

  return (
    <div className="bg-primary-soft min-h-screen pt-32 pb-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Admissions Helpdesk {new Date().getFullYear()}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-800 tracking-tight">Contact HMR Campus</h1>
          <p className="text-base text-neutral-400 font-bold leading-relaxed">
            Have questions about room selections, visits, or booking guidelines? Reach out to our admissions team.
          </p>
        </section>

        {/* Contact info grid & Map */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-neutral-200/50 shadow-sm space-y-6 flex-grow">
              <h3 className="font-black text-xl text-neutral-800">Campus Coordinates</h3>
              
              <div className="space-y-5 text-sm font-extrabold text-neutral-500">
                <div className="flex items-start space-x-3.5">
                  <PhoneCall className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-800 font-black text-base">Helpline (Admissions)</div>
                    <div className="text-neutral-400 mt-1 space-y-1">
                      <a href="tel:+918383027664" className="block hover:underline">+91 83830 27664</a>
                      <a href="tel:+918920011473" className="block hover:underline">+91 89200 11473</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-800 font-black text-base">Admissions Desk</div>
                    <a href="mailto:info@hmrhostel.in" className="text-neutral-400 mt-1 block hover:underline">info@hmrhostel.in</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-800 font-black text-base">HMR Hostel Campus</div>
                    <p className="text-neutral-400 mt-1 leading-relaxed">
                      Gate number 4, Plot Number 40B, near Sharda University, Knowledge Park III, Greater Noida, Uttar Pradesh 201310
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-neutral-800 font-black text-base">Visiting Hours</div>
                    <p className="text-neutral-400 mt-1">10:00 AM - 06:00 PM (Monday - Sunday)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="bg-white p-4 rounded-[32px] border border-neutral-200/50 shadow-sm overflow-hidden h-72 relative">
              <iframe
                title="HMR Hostel Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.279768636599!2d77.4831688755054!3d28.47353919131607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea696446548d%3A0x8673895e69e34e56!2sSharda%20University!5e0!3m2!1sen!2sin!4v1721998500000!5m2!1sen!2sin"
                className="w-full h-full border-0 rounded-2xl"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right panel: Inquiry lead form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[32px] border border-neutral-200/50 shadow-sm space-y-6 flex flex-col justify-center">
            <h3 className="font-black text-2xl text-neutral-800">Send an Inquiry</h3>
            <p className="text-sm text-neutral-400 font-bold -mt-2">Queries submitted generate a live executive follow-up call.</p>
            
            {success ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-start space-x-3 animate-fade-in font-extrabold text-sm">
                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-base">Query Submitted!</h4>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">Our support executive will follow up with you shortly on your registered phone number.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register('name')}
                      className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-accent text-sm text-neutral-800 bg-neutral-50/50 font-bold"
                    />
                    {errors.name && (
                      <p className="text-xs text-danger font-bold mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      {...register('phone')}
                      className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-accent text-sm text-neutral-800 bg-neutral-50/50 font-bold"
                    />
                    {errors.phone && (
                      <p className="text-xs text-danger font-bold mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    {...register('email')}
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-accent text-sm text-neutral-800 bg-neutral-50/50 font-bold"
                  />
                  {errors.email && (
                    <p className="text-xs text-danger font-bold mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-2">Inquiry Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your questions..."
                    {...register('message')}
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-accent text-sm text-neutral-800 bg-neutral-50/50 font-bold"
                  />
                  {errors.message && (
                    <p className="text-xs text-danger font-bold mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-black py-4.5 rounded-xl text-sm transition-all shadow-md shadow-secondary/15 tracking-wider"
                >
                  {isSubmitting ? 'Submitting query...' : 'Send Admissions Enquiry'}
                </button>
              </form>
            )}
          </div>

        </section>

        {/* FAQs Accordion */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-black text-3xl text-neutral-800">Quick Admissions FAQ</h3>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">Have some quick questions? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-200/60 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 font-black text-left text-sm sm:text-base text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <div className={`w-4 h-4 text-neutral-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>▼</div>
                </button>
                {openFaq === index && (
                  <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 text-sm text-neutral-500 leading-relaxed animate-fade-in font-bold">
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
