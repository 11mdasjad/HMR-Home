'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Wifi, Shield, KeyRound, Lock, Flame, ChevronRight, CheckCircle, ArrowRight,
  Sparkles, Building, MapPin, Phone, Mail, Star, Search, Check, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FaWhatsapp } from 'react-icons/fa6';


// Form validation schemas
const leadSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be exactly 10 digits' }),
  email: z.string().email({ message: 'Invalid email ID' }),
  college: z.string().min(2, { message: 'College name is required' }),
  profession: z.enum(['Student', 'Salaried']),
  agree: z.boolean().refine(val => val === true, { message: 'You must agree to the Terms' }),
});

type LeadFormInput = z.infer<typeof leadSchema>;

const inquiry2Schema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be exactly 10 digits' }),
  email: z.string().email({ message: 'Invalid email ID' }),
  college: z.string().min(2, { message: 'College name is required' }),
  agree: z.boolean().refine(val => val === true, { message: 'You must agree to the Terms' }),
});

type Inquiry2FormInput = z.infer<typeof inquiry2Schema>;

// Static Data matching reference exactly
const cities = [
  { name: 'Bengaluru', properties: '8+ Properties', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600' },
  { name: 'Pune', properties: '4+ Properties', image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?q=80&w=600' },
  { name: 'Mumbai', properties: '4+ Properties', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=600' },
  { name: 'Delhi', properties: '4+ Properties', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600' }
];

const amenitiesByTab: Record<
  string,
  { desc: string; character: string; list: { name: string; icon: string }[] }
> = {
  Safety: {
    desc: 'We always have our guards up, to ensure that you can rest easy! From security personnel to lock systems and CCTV cameras, we have them all in place to keep you safe.',
    character: '/images/safety_character.png',
    list: [
      { name: 'CCTV Surveillance', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/cctv_surveillance.png' },
      { name: '24 × 7 Security guard', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/24_x_7_security_guard.png' },
      { name: 'Biometric Access', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/biometric_access.png' },
      { name: '24 × 7 Warden & Property Manager', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/24x7_warden_&_property_manager.png' },
      { name: 'Digital lockers', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/digital_lockers.png' },
      { name: 'Fire safety compliance', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/fire_safety.png' }
    ]
  },
  Community: {
    desc: 'Connect with like-minded folks to bond on everything from assignments to late-night games. Our lounges and cafes are designed to match your tribe.',
    character: '/images/community_character.png',
    list: [
      { name: 'Recreation & Gaming Zone', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/biometric_access.png' },
      { name: 'Common Kitchen access', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/digital_lockers.png' },
      { name: 'Networking Study lounges', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/24x7_warden_&_property_manager.png' },
      { name: 'Active Community Events', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/cctv_surveillance.png' }
    ]
  },
  Comfort: {
    desc: 'Ditch the boring household chores! Leave laundry and room cleaning to us while you snooze your alarm or start working on your startup idea.',
    character: '/images/comfort_character.png',
    list: [
      { name: 'Professional Laundry Support', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/cctv_surveillance.png' },
      { name: 'Daily Room Cleaning', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/digital_lockers.png' },
      { name: '1 Gbps Fibernet Wi-Fi', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/biometric_access.png' },
      { name: 'Silent Split AC & Backup', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/fire_safety.png' }
    ]
  },
  Health: {
    desc: 'Hygienic, nutrition-rich homely meals cooked fresh daily to keep you fit and active throughout the academic year.',
    character: '/images/health_character.png',
    list: [
      { name: 'Nutritious Gourmet Dining', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/24x7_warden_&_property_manager.png' },
      { name: 'Automated Hygienic Kitchen', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/fire_safety.png' },
      { name: 'Equipped Cardio Gym', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/cctv_surveillance.png' },
      { name: '24/7 First-Aid assistance', icon: 'https://ysstaging.s3.ap-south-1.amazonaws.com/media_storages/icons/amenities/biometric_access.png' }
    ]
  }
};

const promotionalSlides = [
  { title: 'Slay everyday with the all YS merch', sub: 'India’s premier student accomodation' },
  { title: 'Experience a new way of living!', sub: 'India’s premier student accomodation' },
  { title: 'Slay everyday with the all YS merch', sub: 'India’s premier student accomodation' },
  { title: 'Experience a new way of living!', sub: 'India’s premier student accomodation' },
  { title: 'Slay everyday with the all YS merch', sub: 'India’s premier student accomodation' },
  { title: 'Experience a new way of living!', sub: 'India’s premier student accomodation' }
];

const colleges = [
  { name: 'Miranda', city: 'Delhi', state: 'Delhi' },
  { name: 'Pearl Academy', city: 'Delhi', state: 'Delhi' },
  { name: 'Kamla Nehru College', city: 'Delhi', state: 'Delhi' },
  { name: 'Lady Shri Ram College', city: 'Delhi', state: 'Delhi' },
  { name: 'Rathore Institute', city: 'Delhi', state: 'Delhi' },
  { name: 'Jamia', city: 'Delhi', state: 'Delhi' },
  { name: 'Maharaja Agrasen institute of Management', city: 'Delhi', state: 'Delhi' },
  { name: 'SRCC', city: 'Delhi', state: 'Delhi' },
  { name: 'Silver Oak', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'IMI', city: 'Delhi', state: 'Delhi' },
  { name: 'IGNOU - Saket', city: 'Delhi', state: 'Delhi' },
  { name: 'CVS', city: 'Delhi', state: 'Delhi' },
  { name: 'Aurobindo', city: 'Delhi', state: 'Delhi' },
  { name: 'Gujarat University', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Ahemdabad University', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Vishwakarma Engineering College', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Dr. Babasaheb Ambedkar Open University', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'North Campus', city: 'Delhi', state: 'Delhi' },
  { name: 'Jain University', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Christ University Hosur Road', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'MSR', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Reva University', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Manipal University', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'IILM', city: 'Gurgaon', state: 'Haryana' },
  { name: 'Ansal University', city: 'Gurgaon', state: 'Haryana' },
  { name: 'Pearl Academy Banglore', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'DU North Campus', city: 'Delhi', state: 'Delhi' },
  { name: 'Allen', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Medicaps University', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'INIFD', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'NMIMS', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'MITHIBAI', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'St. Xavier College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Istituto Marangoni', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'KC', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Indira College of commerce and science', city: 'Pune', state: 'Maharashtra' },
  { name: 'DY Patil University Tathawade', city: 'Pune', state: 'Maharashtra' },
  { name: 'Indus business school', city: 'Pune', state: 'Maharashtra' },
  { name: 'Symbosis', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Galgotiya University', city: 'Greater Noida', state: 'Uttar Pradesh' },
  { name: 'Bennett University', city: 'Greater Noida', state: 'Uttar Pradesh' },
  { name: 'Physics Wallah', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'FITJEE', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'MIT WPU', city: 'Pune', state: 'Maharashtra' },
  { name: 'Government Law College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Prestige College Of Management', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Pearl Academy Jaipur', city: 'Jaipur', state: 'Rajasthan' },
  { name: 'Allen Institute', city: 'Raipur', state: 'Chhattisgarh' },
  { name: 'LS Raheja College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'DJ Sanghvi College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'JSS', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'ISDM', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Jaipuria', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'DME', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Cummins College of Engineering for Women, Pune', city: 'Pune', state: 'Maharashtra' },
  { name: 'JK Shah', city: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Gargi College', city: 'Delhi', state: 'Delhi' },
  { name: 'Ajinkya DY Patil University', city: 'Pune', state: 'Maharashtra' },
  { name: 'Hansraj', city: 'Delhi', state: 'Delhi' },
  { name: 'Hindu', city: 'Delhi', state: 'Delhi' },
  { name: 'St. Stephen', city: 'Delhi', state: 'Delhi' },
  { name: 'CA Institute', city: 'Delhi', state: 'Delhi' },
  { name: 'Nmims Indore', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Allen and Excel Institute', city: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Parag Classes', city: 'Delhi', state: 'Delhi' },
  { name: 'Maharaja Agrasen institute of technology', city: 'Delhi', state: 'Delhi' },
  { name: 'DTU', city: 'Delhi', state: 'Delhi' },
  { name: 'IIT', city: 'Delhi', state: 'Delhi' },
  { name: 'FORE School', city: 'Delhi', state: 'Delhi' },
  { name: 'Deshbandhu', city: 'Delhi', state: 'Delhi' },
  { name: 'Bhagat Singh', city: 'Delhi', state: 'Delhi' },
  { name: 'JNU', city: 'Delhi', state: 'Delhi' },
  { name: 'Centre of Environment Planning & Technology', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Nirma University', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Akash Institute', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Dr. M.K. Shah Medical College and Research Centre', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Accenture', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Presidency College', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Strate School Of Design', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'University Of Petroleum & Energy Research', city: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Pace', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'NMIMS Banglore', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Christ University Bannerghatta', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Nahta CA', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'IPS Academy', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Prestige College Of Engineering', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Whistling Woods International', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pearl Academy Mumbai', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'HR', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Wilson College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Jai Hind College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Sharda University', city: 'Greater Noida', state: 'Uttar Pradesh' },
  { name: 'UPID', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'IMS', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Podar World College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Mukesh Patel College', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Amity University', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Jaypee', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'GL Bajaj', city: 'Greater Noida', state: 'Uttar Pradesh' },
  { name: 'Shri Siddhivinayak Mahila Mahavidyalaya', city: 'Pune', state: 'Maharashtra' },
  { name: 'Excel Coaching', city: 'Raipur', state: 'Chhattisgarh' },
  { name: 'KMC', city: 'Delhi', state: 'Delhi' },
  { name: 'Symbiosis University', city: 'Pune', state: 'Maharashtra' }
];

const whyChooseCards = [
  { slide: 'Slide 1', title: 'Active Community', sub: 'Why HMR Hostel?', desc: 'Connect with like-minded folks to bond on everything from assignments to movies' },
  { slide: 'Slide 2', title: 'Close to Campus', sub: 'Why HMR Hostel?', desc: 'Save time by cutting down on daily travel. Snooze that alarm a little more or start working on your startup idea' },
  { slide: 'Slide 3', title: 'Hassle Free Stay', sub: 'Why HMR Hostel?', desc: 'Solve better problems. Leave the boring ones, like laundry, to us.' },
  { slide: 'Slide 4', title: 'Amazing Amenities', sub: 'Why HMR Hostel?', desc: 'From high speed wifi, to recreation zones to fitness centres, make the most of everyday' }
];

const testimonials = [
  {
    name: 'Ayush Shory',
    college: 'Christ University',
    review: 'The community at yourspace is unmatched. I allso like the modern facilities and how well everything is managed. We have full liberty along with reliable security. Most PGs lack the sense of ease that we are offered at your-space. I have really enjoyed my stay here and would recommend it all my friends and juniors.'
  },
  {
    name: 'Vedika Khandelwal',
    college: 'GL Bajaj',
    review: 'The quality of food is great here & the hospitality is amazing. You do not get the typical boring food that you might associate with hostels. Also, the sense of community make staying at your-space fun. They make you feel at home during festivals with their unique surprises. I made some of my closest friends here.'
  },
  {
    name: 'Sifatraj Singh',
    college: 'SGTB Khalsa College',
    review: 'Google assisted me in finding your space and it was a good recommendation, I must say. I love the services and support that your space provides to all its residents. It’s been an absolute blast for me here at your space, meeting different kinds of people from different parts of the country with different experiences.'
  },
  {
    name: 'Paridhi Agarwal',
    college: 'Symbiosis Law School',
    review: 'I browsed for hostels on the internet and found out the your-space website. The property and rooms are newly built and much cleaner as compared to the other pgs. Also, the facilities attracted me a lot. I love the convenience and facilities that is offered to us. I have to do nothing, life\'s so simple here. Would recommend it to anyone looking for a comfortable stay during college.'
  }
];

const faqs = [
  { q: 'What documents are required for securing a bed?', a: 'You will need to submit a government-issued photo ID (Aadhar Card, PAN Card, or Passport), college admission certificate/fee slip, local guardian address proof, and 4 passport-size photographs.' },
  { q: 'Are meals included in the room packages?', a: 'Yes! Our annual fee packages are fully inclusive of four daily meals (breakfast, lunch, evening tea with snacks, and dinner) served in the communal dining hall.' },
  { q: 'Is high-speed WiFi coverage unlimited?', a: 'Absolutely. HMR Hostel provides unlimited dual-routing high-speed WiFi up to 1 Gbps, covering all study tables, bedrooms, and common areas.' },
  { q: 'Are parents and visitors allowed inside resident rooms?', a: 'Parents and local guardians are welcome inside the common lounges, cafeteria, and visiting zones between 10:00 AM and 6:00 PM. Overnight stays for parents require prior warden clearance.' },
  { q: 'Is vehicle parking space available on campus?', a: 'Yes, we have a demarcated, CCTV-monitored parking zone inside the gate for two-wheelers and four-wheelers.' }
];

export default function HomePage() {
  // Global Header Sync States
  const [headerCity, setHeaderCity] = useState('');
  const [headerSearch, setHeaderSearch] = useState('');

  // Carousel Refs & States
  const [emblaPromoRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [emblaWhyRef] = useEmblaCarousel({ align: 'start', loop: true });
  const [emblaTestimonialsRef, emblaTestimonialsApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // General States
  const [activeAmenityTab, setActiveAmenityTab] = useState('Safety');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [faqSearch, setFaqSearch] = useState('');
  
  // Forms States
  const [profession, setProfession] = useState<'Student' | 'Salaried'>('Student');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [inquirySuccess2, setInquirySuccess2] = useState(false);

  // Form Hooks
  const { register: regLead, handleSubmit: submitLead, setValue: setLeadValue, formState: { errors: leadErrors, isSubmitting: leadSubmitting }, reset: resetLead } = useForm<LeadFormInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { profession: 'Student' }
  });

  const { register: regInquiry2, handleSubmit: submitInquiry2, formState: { errors: inquiry2Errors, isSubmitting: inquiry2Submitting }, reset: resetInquiry2 } = useForm<Inquiry2FormInput>({
    resolver: zodResolver(inquiry2Schema)
  });

  // Listen to custom header sync events
  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const city = (e as CustomEvent).detail;
      setHeaderCity(city);
    };

    const handleLocationSearch = (e: Event) => {
      const query = (e as CustomEvent).detail;
      setHeaderSearch(query);
    };

    window.addEventListener('city-change', handleCityChange);
    window.addEventListener('location-search', handleLocationSearch);

    return () => {
      window.removeEventListener('city-change', handleCityChange);
      window.removeEventListener('location-search', handleLocationSearch);
    };
  }, []);

  // Sync testimonials index
  useEffect(() => {
    if (!emblaTestimonialsApi) return;
    emblaTestimonialsApi.on('select', () => {
      setCurrentTestimonial(emblaTestimonialsApi.selectedScrollSnap());
    });
  }, [emblaTestimonialsApi]);

  const onLeadSubmit = async (data: LeadFormInput) => {
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          college: data.college,
          profession: data.profession
        }
      ]);
      if (error) throw error;
      setLeadSuccess(true);
      resetLead();
    } catch (err) {
      console.error('Error saving inquiry:', err);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const onInquiry2Submit = async (data: Inquiry2FormInput) => {
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          college: data.college,
          profession: 'Student' // Default to Student for form 2 submissions
        }
      ]);
      if (error) throw error;
      setInquirySuccess2(true);
      resetInquiry2();
    } catch (err) {
      console.error('Error saving inquiry:', err);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  // Filter Colleges based on search query, header city, or header search
  const filteredColleges = colleges.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(collegeSearch.toLowerCase());
    
    const matchHeaderCity = headerCity ? c.city.toLowerCase() === headerCity.toLowerCase() : true;
    const matchHeaderSearch = headerSearch
      ? c.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
        c.city.toLowerCase().includes(headerSearch.toLowerCase())
      : true;

    return matchSearch && matchHeaderCity && matchHeaderSearch;
  });

  const filteredFaqs = faqs.filter((f) =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pt-16">
      
      {/* 2. Hero Section (Split Layout matching screenshot exactly) */}
      <section id="hero" className="py-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Card + Text Overlay */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-neutral-100 aspect-[16/10]">
              <img
                src="/images/hero_room.png"
                alt="Your Home away from Home"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
              
              {/* Bold Overlay Text - Enlarged */}
              <div className="absolute bottom-10 left-10 right-10">
                <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                  Your Home <br />
                  away from Home
                </h1>
              </div>
            </div>
            
            {/* Description Subtext - Enlarged */}
            <p className="text-lg sm:text-xl text-neutral-600 font-extrabold leading-relaxed max-w-2xl">
              Comfort of modern amenities, warmth of homely meals and a tribe that matches your vibe <span className="text-accent font-black">#MakeItYours</span>
            </p>
          </div>

          {/* Right Column: Lead Inquiry Form Card (Enlarged) */}
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-[32px] border border-neutral-200/60 shadow-xl relative scroll-mt-20">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-neutral-800 tracking-tight">
                Interested in a <span className="text-secondary">Hostel?</span>
              </h2>
              <p className="text-sm text-neutral-400 font-extrabold leading-normal">
                Tell us your contact number and we’ll reach out to you soon.
              </p>
            </div>

            {leadSuccess ? (
              <div className="mt-8 p-8 bg-accent/10 border border-accent/20 text-accent rounded-3xl text-center space-y-4 animate-fade-in font-extrabold text-sm">
                <CheckCircle className="w-12 h-12 mx-auto" />
                <h4 className="font-extrabold text-base">Successfully Submitted!</h4>
                <p className="text-xs text-neutral-500">Our team will call you back shortly.</p>
                <button onClick={() => setLeadSuccess(false)} className="text-sm underline font-bold text-neutral-600 hover:text-accent">Submit another contact request</button>
              </div>
            ) : (
              <form onSubmit={submitLead(onLeadSubmit)} className="mt-8 space-y-5">
                
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      {...regLead('firstName')}
                      className="w-full px-4.5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-accent text-neutral-800 placeholder-neutral-400 font-bold"
                    />
                    {leadErrors.firstName && (
                      <p className="text-xs text-danger font-bold mt-1">{leadErrors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      {...regLead('lastName')}
                      className="w-full px-4.5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-accent text-neutral-800 placeholder-neutral-400 font-bold"
                    />
                    {leadErrors.lastName && (
                      <p className="text-xs text-danger font-bold mt-1">{leadErrors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* College name */}
                <div>
                  <input
                    type="text"
                    placeholder="College name"
                    {...regLead('college')}
                    className="w-full px-4.5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-accent text-neutral-800 placeholder-neutral-400 font-bold"
                  />
                  {leadErrors.college && (
                    <p className="text-xs text-danger font-bold mt-1">{leadErrors.college.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex gap-2">
                  <span className="bg-neutral-50 border border-neutral-200 px-5 py-3.5 rounded-xl text-sm font-extrabold text-neutral-500 flex items-center justify-center flex-shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Contact number"
                    {...regLead('phone')}
                    className="w-full px-4.5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-accent text-neutral-800 placeholder-neutral-400 font-bold"
                  />
                </div>
                {leadErrors.phone && (
                  <p className="text-xs text-danger font-bold mt-1">{leadErrors.phone.message}</p>
                )}

                {/* Email ID */}
                <div>
                  <input
                    type="email"
                    placeholder="Email ID"
                    {...regLead('email')}
                    className="w-full px-4.5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-accent text-neutral-800 placeholder-neutral-400 font-bold"
                  />
                  {leadErrors.email && (
                    <p className="text-xs text-danger font-bold mt-1">{leadErrors.email.message}</p>
                  )}
                </div>

                {/* Tabs Student / Salaried */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfession('Student');
                      setLeadValue('profession', 'Student');
                    }}
                    className={`py-4.5 rounded-xl text-sm font-black transition-all border ${
                      profession === 'Student'
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                        : 'bg-white border-neutral-200 text-neutral-500'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfession('Salaried');
                      setLeadValue('profession', 'Salaried');
                    }}
                    className={`py-4.5 rounded-xl text-sm font-black transition-all border ${
                      profession === 'Salaried'
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                        : 'bg-white border-neutral-200 text-neutral-500'
                    }`}
                  >
                    Salaried
                  </button>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start space-x-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    {...regLead('agree')}
                    className="w-5 h-5 text-accent border-neutral-300 rounded focus:ring-accent mt-0.5"
                  />
                  <label htmlFor="agree" className="text-xs text-neutral-400 font-bold leading-normal">
                    I have read and agreed to the <span className="text-accent underline cursor-pointer">Terms of Services</span> and <span className="text-accent underline cursor-pointer">Privacy Policy</span> and hereby confirm to proceed.
                  </label>
                </div>
                {leadErrors.agree && (
                  <p className="text-xs text-danger font-bold mt-1">{leadErrors.agree.message}</p>
                )}

                {/* GET A CALL BACK button */}
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-black py-4.5 rounded-full text-sm transition-all shadow-md shadow-accent/25 tracking-widest"
                >
                  {leadSubmitting ? 'SUBMITTING...' : 'GET A CALL BACK'}
                </button>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* 3. Amenities Section (Matching reference screenshot 3-column layout exactly, with larger fonts) */}
      <section id="amenities" className="py-24 bg-neutral-50/40 px-4 sm:px-8 border-y border-neutral-200/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header - Enlarged */}
          <div className="text-left max-w-xl">
            <h2 className="text-5xl sm:text-6xl font-black text-accent leading-none tracking-tight">
              Amenities
            </h2>
            <h2 className="text-5xl sm:text-6xl font-black text-neutral-800 tracking-tight mt-2">
              that you’ll find
            </h2>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-8">
            
            {/* Column 1: Tabs Sidebar - Horizontally Scrollable on Mobile */}
            <div className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-3 pb-4 md:pb-0 scrollbar-none flex-nowrap -mx-4 px-4 md:mx-0 md:px-0">
              {['Safety', 'Community', 'Comfort', 'Health'].map((tab) => {
                const isActive = activeAmenityTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveAmenityTab(tab)}
                    className={`flex-shrink-0 md:w-full flex items-center justify-between px-6 py-4.5 md:py-5 rounded-[20px] md:rounded-[24px] text-sm md:text-base font-black transition-all border ${
                      isActive
                        ? 'border-2 border-emerald-500 text-emerald-600 bg-white shadow-sm'
                        : 'border-neutral-200 text-neutral-500 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <span>{tab}</span>
                    <ChevronRight className={`hidden md:block w-5 h-5 ${isActive ? 'text-emerald-500' : 'text-neutral-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Column 2: Center Details & Cute Character Sketch */}
            <div className="md:col-span-5 bg-white p-8 sm:p-10 rounded-[32px] border border-neutral-200/50 shadow-sm flex flex-col justify-between space-y-8 min-h-[380px] md:min-h-[460px]">
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-accent">{activeAmenityTab}</h3>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-bold">
                  {amenitiesByTab[activeAmenityTab].desc}
                </p>
              </div>

              {/* Hand-drawn Vector Cartoon Sketch */}
              <div className="flex justify-center items-center">
                <img
                  src={amenitiesByTab[activeAmenityTab].character}
                  alt={`${activeAmenityTab} Illustration`}
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            {/* Column 3: Vertically Stacked Amenities List */}
            <div className="md:col-span-4 space-y-4 bg-white/40 p-6 rounded-[28px] border border-neutral-100">
              {amenitiesByTab[activeAmenityTab].list.map((am, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-neutral-200/40 shadow-sm hover:border-accent/30 transition-all group cursor-pointer"
                >
                  <img
                    src={am.icon}
                    alt={am.name}
                    className="w-9 h-9 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      // Fallback if staging link fails
                      (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png';
                    }}
                  />
                  <span className="text-base font-black text-neutral-800">{am.name}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 4. Explore Top Cities (Enlarged) */}
      <section id="cities" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-neutral-800">
              Explore <span className="text-accent">our top cities</span>
            </h2>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">India's leading hubs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {cities.map((city, idx) => (
              <div
                key={idx}
                className="relative h-96 rounded-[28px] overflow-hidden shadow-lg group cursor-pointer border border-neutral-100"
                onClick={() => scrollToSection('colleges')}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                  <h3 className="font-black text-2xl">{city.name}</h3>
                  <div className="flex justify-between items-center text-sm text-neutral-300 font-bold">
                    <span>{city.properties}</span>
                    <span className="flex items-center space-x-1.5 text-accent group-hover:translate-x-1.5 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Hero inquiry form #2 (repeated in requested sections list, with enlarged fields) */}
      <section className="py-16 bg-neutral-50/50 border-t border-neutral-200/40 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-primary rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-bl-full -z-10" />
          
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black">Interested in a Hostel?</h2>
            <p className="text-sm text-neutral-400 font-bold">
              Tell us your contact number and we’ll reach out to you soon.
            </p>
          </div>

          {inquirySuccess2 ? (
            <div className="p-6 bg-accent/10 border border-accent/25 text-accent rounded-xl text-center space-y-4 max-w-sm mx-auto font-black text-sm">
              <CheckCircle className="w-8 h-8 mx-auto" />
              <h4 className="font-extrabold text-base">Successfully Submitted!</h4>
              <button onClick={() => setInquirySuccess2(false)} className="text-sm text-white underline">Submit another callback</button>
            </div>
          ) : (
            <form onSubmit={submitInquiry2(onInquiry2Submit)} className="space-y-5 max-w-2xl mx-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  {...regInquiry2('firstName')}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent text-white font-bold"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  {...regInquiry2('lastName')}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="College name"
                  {...regInquiry2('college')}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent text-white font-bold"
                />
                <input
                  type="email"
                  placeholder="Email ID"
                  {...regInquiry2('email')}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent text-white font-bold"
                />
              </div>

              <div className="flex gap-2">
                <span className="bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-sm font-bold text-neutral-400 flex items-center justify-center">+91</span>
                <input
                  type="tel"
                  placeholder="Contact number"
                  {...regInquiry2('phone')}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent text-white font-bold"
                />
              </div>

              <div className="flex items-start space-x-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree2"
                  {...regInquiry2('agree')}
                  className="w-5 h-5 text-accent border-white/10 bg-white/5 rounded focus:ring-accent mt-0.5"
                />
                <label htmlFor="agree2" className="text-xs text-neutral-400 leading-normal font-bold">
                  I have read and agreed to the <span className="text-accent underline cursor-pointer">Terms of Services</span> and <span className="text-accent underline cursor-pointer">Privacy Policy</span> and hereby confirm to proceed.
                </label>
              </div>

              <button
                type="submit"
                disabled={inquiry2Submitting}
                className="w-full bg-accent hover:bg-accent-dark text-white font-black py-4 rounded-full text-sm transition-all shadow-md shadow-accent/20 tracking-wider uppercase"
              >
                {inquiry2Submitting ? 'SUBMITTING...' : 'GET A CALL BACK'}
              </button>

            </form>
          )}

        </div>
      </section>

      {/* 5. Promotional slides - Enlarged */}
      <section className="bg-neutral-950 text-white py-16 relative overflow-hidden">
        <div className="embla overflow-hidden" ref={emblaPromoRef}>
          <div className="embla__container flex">
            {promotionalSlides.map((slide, i) => (
              <div key={i} className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 px-8 border-r border-white/5 text-center flex flex-col justify-between py-6 h-56 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-100 leading-snug">{slide.title}</h3>
                  <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">{slide.sub}</p>
                </div>
                <div>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="bg-accent hover:bg-accent-dark text-white text-xs font-black px-7 py-3.5 rounded-full tracking-wider uppercase transition-colors"
                  >
                    book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Colleges Near HMR Hostel (Searchable Grid, Enlarged) */}
      <section id="colleges" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-neutral-800">
              Colleges <span className="text-accent">Near HMR Hostel</span>
            </h2>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">Commute-friendly accommodations</p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search colleges (e.g. LSR, Christ, DTU...)"
              value={collegeSearch}
              onChange={(e) => setCollegeSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:border-accent text-neutral-800 font-bold"
            />
          </div>

          {filteredColleges.length === 0 ? (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl">
              <p className="text-sm text-neutral-400 font-bold">No colleges matching your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto pr-2">
              {filteredColleges.map((col, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-neutral-100 hover:border-accent/30 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-neutral-800 leading-tight">{col.name}</h4>
                    <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-wider">{col.city}, {col.state}</p>
                  </div>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="text-left text-xs font-black text-secondary hover:text-secondary-dark flex items-center space-x-1.5 group"
                  >
                    <span>Find Hostels Nearby</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 7. Why HMR Hostel? - Slider Cards Enlarged */}
      <section id="why" className="py-24 bg-neutral-50/50 px-4 sm:px-8 border-y border-neutral-200/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-neutral-800">
              Why <span className="text-accent">HMR Hostel?</span>
            </h2>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">The core HMR pillars</p>
          </div>

          <div className="embla overflow-hidden" ref={emblaWhyRef}>
            <div className="embla__container flex gap-6">
              {whyChooseCards.map((card, idx) => (
                <div
                  key={idx}
                  className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] min-w-0 bg-white p-8 sm:p-10 rounded-[32px] border border-neutral-100 shadow-sm space-y-5 flex-shrink-0"
                >
                  <div className="flex justify-between items-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
                    <span>{card.slide}</span>
                    <span className="text-accent text-sm font-black">{card.title}</span>
                  </div>
                  <h3 className="font-black text-xl text-neutral-800">{card.sub}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed font-bold">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. Hear It From Our Residents - Testimonials Enlarged */}
      <section id="testimonials" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-neutral-800">
              Hear it from <span className="text-accent">Our Residents</span>
            </h2>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">Real reviews from our spaces</p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div className="embla overflow-hidden" ref={emblaTestimonialsRef}>
              <div className="embla__container flex">
                {testimonials.map((test, index) => (
                  <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 px-4">
                    <div className="bg-white p-10 sm:p-12 rounded-[32px] border border-neutral-200/60 shadow-lg relative flex flex-col items-center text-center space-y-8">
                      <blockquote className="text-sm sm:text-base text-neutral-600 leading-relaxed font-extrabold italic max-w-xl">
                        "{test.review}"
                      </blockquote>

                      <div>
                        <h4 className="font-black text-neutral-800 text-base sm:text-lg">{test.name}</h4>
                        <p className="text-xs text-neutral-400 font-extrabold uppercase mt-1 tracking-wider">
                          Resident, {test.college}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots navigation indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => emblaTestimonialsApi?.scrollTo(dotIdx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentTestimonial === dotIdx ? 'bg-accent w-6' : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 9. Find us in your City (Google Maps Embed + Contacts Details, Enlarged) */}
      <section id="contact" className="py-24 bg-neutral-50/50 px-4 sm:px-8 border-y border-neutral-200/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-neutral-800">
              Find us in <span className="text-accent">your City</span>
            </h2>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">Our locations include</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Map Frame (Google Maps Sharda University) */}
            <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-neutral-200/50 shadow-sm min-h-[350px]">
              <iframe
                title="HMR Hostel Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.279768636599!2d77.4831688755054!3d28.47353919131607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea696446548d%3A0x8673895e69e34e56!2sSharda%20University!5e0!3m2!1sen!2sin!4v1721998500000!5m2!1sen!2sin"
                className="w-full h-full border-0 rounded-2xl min-h-[320px]"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address Details Card */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-neutral-200/50 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <h3 className="font-black text-xl text-neutral-800">Coordinates</h3>
                
                <div className="space-y-5 text-sm font-extrabold text-neutral-500">
                  <div className="flex items-start space-x-3.5">
                    <Mail className="w-5.5 h-5.5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-neutral-800 font-black">Email Admissions</div>
                      <a href="mailto:info@hmrhostel.in" className="text-neutral-400 mt-1 block hover:underline">info@hmrhostel.in</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Phone className="w-5.5 h-5.5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-neutral-800 font-black">Helplines</div>
                      <div className="text-neutral-400 mt-1 space-y-0.5">
                        <a href="tel:+918383027664" className="block hover:underline">+91 83830 27664</a>
                        <a href="tel:+918920011473" className="block hover:underline">+91 89200 11473</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <MapPin className="w-5.5 h-5.5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-neutral-800 font-black">Campus Address</div>
                      <p className="text-neutral-400 mt-1 leading-relaxed">
                        Gate number 4, Plot Number 40B, near Sharda University, Knowledge Park III, Greater Noida, Uttar Pradesh 201310
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-400 font-extrabold italic leading-normal border-t border-neutral-100 pt-4">
                Note: Images shown are for representational purposes only. Amenities depicted may or may not form a part of that individual property.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 10. Frequently Asked Questions (Enlarged) */}
      <section id="faq" className="py-24 px-4 sm:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-neutral-800">
              Frequently <span className="text-accent">Asked Questions</span>
            </h2>
            <p className="text-xs text-neutral-400 font-extrabold uppercase tracking-widest">Instant support answers</p>
          </div>

          <div className="max-w-md mx-auto relative mb-6">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-neutral-200 focus:outline-none focus:border-accent text-sm text-neutral-800 font-extrabold bg-neutral-50/50"
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl">
              <p className="text-sm text-neutral-400 font-bold">No FAQs match your search query.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <details
                  key={index}
                  name="faq-accordion"
                  className="disclosure group border border-neutral-200/50 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300"
                >
                  <summary className="w-full list-none flex items-center justify-between p-6 font-extrabold text-left text-sm sm:text-base text-neutral-700 hover:bg-neutral-50 cursor-pointer focus:outline-none">
                    <span>{faq.q}</span>
                    <div className="w-4 h-4 text-neutral-400 group-open:rotate-180 transition-transform duration-250">▼</div>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-sm text-neutral-500 leading-relaxed border-t border-neutral-100/50 bg-neutral-50/20">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918383027664"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact HMR Hostel on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>

    </div>
  );
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
