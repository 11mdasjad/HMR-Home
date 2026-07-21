'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE, getAuthToken, getAuthUser } from '../../lib/clientState';
import { Check, CreditCard, FileText, Upload, User, Bed, ShieldAlert, Award, FileSpreadsheet, Download } from 'lucide-react';

function BookingWizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard Steps: 1: Auth, 2: Room/Bed, 3: Details, 4: Docs, 5: Pay, 6: Confirm
  const [step, setStep] = useState(1);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  // Selection States
  const [roomCategory, setRoomCategory] = useState('Single Seater');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedBed, setSelectedBed] = useState<string>('');

  // Form Details
  const [detailsForm, setDetailsForm] = useState({
    fullName: '', fatherName: '', motherName: '', gender: 'Male', dob: '',
    phone: '', emergencyContact: '', collegeName: '', course: '', year: '1st Year',
    studentId: '', aadharNumber: '', permanentAddress: '', currentAddress: '',
    guardianName: '', guardianPhone: '', guardianRelation: '',
    bloodGroup: 'O+', medicalHistory: ''
  });

  // Docs URLs
  const [docs, setDocs] = useState({
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    aadharUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop',
    collegeIdUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    signatureUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop'
  });

  // Booking Results
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync Search Params on load
  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);
    
    const user = getAuthUser();
    if (token && user) {
      setStep(2);
      if (user.name) {
        setDetailsForm(prev => ({ ...prev, fullName: user.name, phone: user.phone || '' }));
      }
    }

    const paramCat = searchParams.get('category');
    const paramRoomId = searchParams.get('roomId');
    const paramRoomNum = searchParams.get('roomNumber');

    if (paramCat) setRoomCategory(paramCat);
    if (paramRoomId && paramRoomNum) {
      setSelectedRoom({ id: paramRoomId, roomNumber: paramRoomNum, price: paramCat === 'Single Seater' ? 160000 : paramCat === '2 Seater' ? 140000 : 125000 });
    }
  }, [searchParams]);

  // Load Rooms based on selected Category
  useEffect(() => {
    if (step === 2) {
      const fetchCategoryRooms = async () => {
        try {
          const res = await fetch(`${API_BASE}/rooms`);
          if (res.ok) {
            const data = await res.json();
            const matched = data.filter((r: any) => r.category === roomCategory && r.status !== 'MAINTENANCE');
            setAvailableRooms(matched);
            // Auto select first if none selected
            if (matched.length > 0 && !selectedRoom) {
              setSelectedRoom(matched[0]);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchCategoryRooms();
    }
  }, [roomCategory, step]);

  // Lead Generation Capture (Before Payment - Triggered on step 3 exit)
  const saveSupportLead = async () => {
    try {
      const user = getAuthUser();
      await fetch(`${API_BASE}/bookings/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: detailsForm.fullName,
          email: user?.email || 'unknown@student.com',
          phone: detailsForm.phone,
          preferredCategory: roomCategory,
          selectedRoomNumber: selectedRoom?.roomNumber,
          selectedBedNumber: selectedBed,
          bookingProgress: 'Profile Details Form Complete'
        })
      });
    } catch (e) {
      console.warn('Lead capture failed to register:', e);
    }
  };

  const handleNextStep = () => {
    setError('');
    if (step === 2 && (!selectedRoom || !selectedBed)) {
      setError('Please select a room and available bed layout.');
      return;
    }
    if (step === 3) {
      if (!detailsForm.fullName || !detailsForm.phone || !detailsForm.aadharNumber) {
        setError('Please complete the required fields (Full Name, Phone, Aadhar Number).');
        return;
      }
      saveSupportLead();
    }
    setStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  // Payment integration simulator
  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const user = getAuthUser();
      const token = getAuthToken();

      const res = await fetch(`${API_BASE}/bookings/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          bedNumber: selectedBed,
          paymentMethod: 'Razorpay UPI Gateway',
          amountPaid: selectedRoom.price,
          ...detailsForm,
          ...docs
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Payment capture failed');
      }

      setBookingResult(data.booking);
      setStep(6);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Step Tracker Headers */}
      <div className="mb-12">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
          <span>Booking Wizard</span>
          <span>Step {step} of 6</span>
        </div>
        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all ${i < step ? 'bg-secondary' : 'bg-transparent'} ${i === step - 1 ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-danger/10 border border-danger/25 text-danger rounded-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: AUTHENTICATION CHECK */}
      {step === 1 && (
        <div className="glass-card rounded-3xl p-8 border border-white/60 text-center space-y-6">
          <Award className="w-16 h-16 text-secondary mx-auto" />
          <h2 className="text-2xl font-extrabold text-neutral-800">Identify Yourself</h2>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            You must be signed in to reserve a room and complete smart bed allocation.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ROOM & BED SELECTOR */}
      {step === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-neutral-800">Choose Room Category</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Single Seater', '2 Seater', '3 Seater'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setRoomCategory(cat); setSelectedRoom(null); setSelectedBed(''); }}
                  className={`p-4 rounded-2xl border text-center font-bold transition-all ${roomCategory === cat ? 'border-secondary bg-secondary/5 text-secondary' : 'border-neutral-200 text-neutral-500'}`}
                >
                  <div className="text-sm">{cat}</div>
                  <div className="text-xs font-medium text-neutral-400 mt-1">₹{cat === 'Single Seater' ? '1.60 Lakh' : cat === '2 Seater' ? '1.40 Lakh' : '1.25 Lakh'}/annum</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rooms Grid list */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg text-neutral-800">Select Available Room</h3>
              <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto no-scrollbar">
                {availableRooms.map(room => {
                  const occupancy = room.occupancy || 0;
                  const isRoomFull = occupancy >= room.capacity;
                  const isRoomSelected = selectedRoom?.id === room.id;
                  
                  return (
                    <button
                      key={room.id}
                      disabled={isRoomFull}
                      onClick={() => { setSelectedRoom(room); setSelectedBed(''); }}
                      className={`p-3 rounded-xl border font-bold text-center text-sm transition-all flex flex-col justify-between items-center ${isRoomFull ? 'bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed' : isRoomSelected ? 'border-secondary bg-secondary/10 text-secondary' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                    >
                      <span>Rm {room.roomNumber}</span>
                      <span className="text-[10px] font-semibold text-neutral-400 mt-1">{occupancy}/{room.capacity} filled</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bed picker layout */}
            {selectedRoom && (
              <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-lg text-neutral-800">Select Bed Layout</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: selectedRoom.capacity }).map((_, i) => {
                    const bedId = `Bed ${String.fromCharCode(65 + i)}`; // Bed A, B, C
                    const isBedOccupied = i < selectedRoom.occupancy;
                    const isSelected = selectedBed === bedId;

                    return (
                      <button
                        key={i}
                        disabled={isBedOccupied}
                        onClick={() => setSelectedBed(bedId)}
                        className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-sm transition-all ${isBedOccupied ? 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed' : isSelected ? 'border-secondary bg-secondary/5 text-secondary' : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Bed className="w-5 h-5" />
                          <span>{bedId}</span>
                        </div>
                        <span className="text-xs font-semibold">{isBedOccupied ? 'Occupied' : 'Select Bed'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextStep}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all"
            >
              Continue to Student Profile
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS FORM */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-8 animate-fade-in">
          <div>
            <h3 className="font-extrabold text-xl text-neutral-800">Student Profile Information</h3>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Provide correct information to finalize check-in clearances.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={detailsForm.fullName}
                onChange={e => setDetailsForm({ ...detailsForm, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Father Name</label>
              <input
                type="text"
                placeholder="Father's Name"
                value={detailsForm.fatherName}
                onChange={e => setDetailsForm({ ...detailsForm, fatherName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Mother Name</label>
              <input
                type="text"
                placeholder="Mother's Name"
                value={detailsForm.motherName}
                onChange={e => setDetailsForm({ ...detailsForm, motherName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Gender</label>
              <select
                value={detailsForm.gender}
                onChange={e => setDetailsForm({ ...detailsForm, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Date of Birth</label>
              <input
                type="date"
                value={detailsForm.dob}
                onChange={e => setDetailsForm({ ...detailsForm, dob: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Aadhar Number</label>
              <input
                type="text"
                placeholder="12 digit ID"
                value={detailsForm.aadharNumber}
                onChange={e => setDetailsForm({ ...detailsForm, aadharNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone</label>
              <input
                type="tel"
                value={detailsForm.phone}
                onChange={e => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Emergency Contact</label>
              <input
                type="tel"
                placeholder="Parent or Guardian"
                value={detailsForm.emergencyContact}
                onChange={e => setDetailsForm({ ...detailsForm, emergencyContact: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Blood Group</label>
              <select
                value={detailsForm.bloodGroup}
                onChange={e => setDetailsForm({ ...detailsForm, bloodGroup: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">College Name</label>
              <input
                type="text"
                placeholder="University"
                value={detailsForm.collegeName}
                onChange={e => setDetailsForm({ ...detailsForm, collegeName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Course Name</label>
              <input
                type="text"
                placeholder="e.g. B.Tech CS"
                value={detailsForm.course}
                onChange={e => setDetailsForm({ ...detailsForm, course: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Student Roll ID</label>
              <input
                type="text"
                placeholder="College Roll No."
                value={detailsForm.studentId}
                onChange={e => setDetailsForm({ ...detailsForm, studentId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Current Address</label>
              <input
                type="text"
                value={detailsForm.currentAddress}
                onChange={e => setDetailsForm({ ...detailsForm, currentAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Permanent Address</label>
              <input
                type="text"
                value={detailsForm.permanentAddress}
                onChange={e => setDetailsForm({ ...detailsForm, permanentAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleBackStep}
              className="border border-neutral-200 text-neutral-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-neutral-50 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all"
            >
              Next: Upload Documents
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENT UPLOADS */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-8 animate-fade-in">
          <div>
            <h3 className="font-extrabold text-xl text-neutral-800">Upload KYC Documents</h3>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Mock upload. Selected default simulation documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-neutral-200 p-6 rounded-2xl text-center space-y-3 bg-neutral-50/50 hover:bg-neutral-50 transition-all">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-bold text-sm text-neutral-700">Passport Size Photo</div>
              <div className="text-xs text-neutral-400">JPG or PNG (max 2MB)</div>
              <div className="inline-block text-xs bg-accent/15 text-accent-dark px-3 py-1 rounded-full font-bold">✓ Simulated Uploaded</div>
            </div>

            <div className="border-2 border-dashed border-neutral-200 p-6 rounded-2xl text-center space-y-3 bg-neutral-50/50 hover:bg-neutral-50 transition-all">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-bold text-sm text-neutral-700">Aadhar card (PDF)</div>
              <div className="text-xs text-neutral-400">Front & Back combined</div>
              <div className="inline-block text-xs bg-accent/15 text-accent-dark px-3 py-1 rounded-full font-bold">✓ Simulated Uploaded</div>
            </div>

            <div className="border-2 border-dashed border-neutral-200 p-6 rounded-2xl text-center space-y-3 bg-neutral-50/50 hover:bg-neutral-50 transition-all">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-bold text-sm text-neutral-700">College ID Proof</div>
              <div className="text-xs text-neutral-400">Front card view</div>
              <div className="inline-block text-xs bg-accent/15 text-accent-dark px-3 py-1 rounded-full font-bold">✓ Simulated Uploaded</div>
            </div>

            <div className="border-2 border-dashed border-neutral-200 p-6 rounded-2xl text-center space-y-3 bg-neutral-50/50 hover:bg-neutral-50 transition-all">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-bold text-sm text-neutral-700">Student Signature (PNG)</div>
              <div className="text-xs text-neutral-400">Transparent signature</div>
              <div className="inline-block text-xs bg-accent/15 text-accent-dark px-3 py-1 rounded-full font-bold">✓ Simulated Uploaded</div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleBackStep}
              className="border border-neutral-200 text-neutral-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-neutral-50 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all"
            >
              Next: Review & Payment
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PAYMENT (RAZORPAY SIMULATION DRAWER) */}
      {step === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Summary Panel */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-xl text-neutral-800">Booking Summary</h3>
            
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="font-semibold">Student Name:</span>
                <span className="font-bold text-neutral-800">{detailsForm.fullName}</span>
              </div>
              <div className="flex justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="font-semibold">Selected Room:</span>
                <span className="font-bold text-neutral-800">Room {selectedRoom.roomNumber} ({selectedRoom.category})</span>
              </div>
              <div className="flex justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="font-semibold">Bed Allocation:</span>
                <span className="font-bold text-neutral-800">{selectedBed}</span>
              </div>
              <div className="flex justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="font-semibold">Floor:</span>
                <span className="font-bold text-neutral-800">Floor {selectedRoom.floor}</span>
              </div>
              <div className="flex justify-between p-3 bg-neutral-50 rounded-xl">
                <span className="font-semibold">Aadhar:</span>
                <span className="font-bold text-neutral-800">{detailsForm.aadharNumber}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-100">
              <button
                onClick={handleBackStep}
                className="border border-neutral-200 text-neutral-600 font-bold px-6 py-3 rounded-xl hover:bg-neutral-50 transition-all text-xs"
              >
                Change Details
              </button>
            </div>
          </div>

          {/* Payment Gateway Box */}
          <div className="lg:col-span-5 bg-neutral-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full font-bold">Razorpay checkout</span>
                <CreditCard className="w-5 h-5 text-secondary" />
              </div>
              
              <div>
                <span className="text-xs text-white/50 block font-medium">TOTAL HOSTEL FEES (ANNUAL)</span>
                <span className="text-3xl font-extrabold text-white">₹{selectedRoom.price >= 100000 ? `${(selectedRoom.price / 100000).toFixed(2)} Lakh` : selectedRoom.price}</span>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Room Security Deposit</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">WiFi & Utilities Fee</span>
                  <span>Free</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/25 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Processing transaction...' : `Pay ₹${selectedRoom.price} via Razorpay`}</span>
              </button>
              <span className="text-[10px] text-white/30 text-center block mt-3">Fully encrypted. 256-bit SSL transaction channel.</span>
            </div>
          </div>

        </div>
      )}

      {/* STEP 6: BOOKING CONFIRMATION & RECEIPT */}
      {step === 6 && bookingResult && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-2xl p-8 space-y-8 animate-fade-in text-center">
          <div className="w-16 h-16 bg-accent/10 text-accent-dark rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-neutral-800">Booking Reservation Complete!</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Welcome to HMR Hostel family. Your bed is secured.</p>
          </div>

          {/* Ticket styling receipt */}
          <div className="border border-neutral-200/60 rounded-2xl p-6 bg-neutral-50/50 space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-neutral-200">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wide">Receipt Ticket</span>
              <span className="text-xs font-bold text-secondary">{bookingResult.bookingId}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 block font-medium">Student</span>
                <span className="font-bold text-neutral-700">{bookingResult.fullName}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Allotment</span>
                <span className="font-bold text-neutral-700">Room {selectedRoom.roomNumber} ({selectedBed})</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Transaction ID</span>
                <span className="font-bold text-neutral-700">{bookingResult.paymentId}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Status</span>
                <span className="font-bold text-emerald-600">PAID & ALLOCATED</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center border-t border-neutral-200">
              {/* QR Code Simulation */}
              <div className="w-32 h-32 bg-white p-2 border border-neutral-200 rounded-xl flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HMR_HOSTEL_BKG_1002"
                  alt="Receipt QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold mt-2">Scan QR code at check-in counter</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => router.push('/student')}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
            >
              Go to Student Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingWizard() {
  return (
    <React.Suspense fallback={
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary mx-auto"></div>
        <p className="mt-4 text-sm font-semibold text-neutral-400">Loading booking portal...</p>
      </div>
    }>
      <BookingWizardInner />
    </React.Suspense>
  );
}
