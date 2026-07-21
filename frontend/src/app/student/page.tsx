'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { API_BASE, SOCKET_BASE, getAuthToken, getAuthUser } from '../../lib/clientState';
import Logo from '../../components/Logo';
import {
  User, ShieldCheck, CreditCard, HelpCircle, AlertCircle, Send, Bell,
  Download, QrCode, PhoneCall, RefreshCw
} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Complaint Form
  const [compForm, setCompForm] = useState({ category: 'INTERNET', description: '' });
  const [raisingComp, setRaisingComp] = useState(false);
  const [compSuccess, setCompSuccess] = useState('');

  // Support Chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch Profile
      const profileRes = await fetch(`${API_BASE}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      } else {
        router.push('/login');
        return;
      }

      // Fetch Complaints
      const compRes = await fetch(`${API_BASE}/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaints(compData);
      }

      // Fetch Announcements
      const annRes = await fetch(`${API_BASE}/announcements`);
      if (annRes.ok) {
        const annData = await annRes.json();
        setAnnouncements(annData);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Setup Socket.io connection for chat and notifications
    const socketIo = io(SOCKET_BASE);
    setSocket(socketIo);

    socketIo.on('connect', () => {
      const user = getAuthUser();
      if (user) {
        // Join user-specific chat room
        socketIo.emit('join_room', `chat_${user.id}`);
        
        // Load default greeting
        setChatMessages([
          { id: 'msg_greet', text: `Hello ${user.name}, welcome to HMR support. How can we help you today?`, sender: 'SUPPORT', timestamp: new Date() }
        ]);
      }
    });

    socketIo.on('receive_message', (message: any) => {
      setChatMessages((prev) => [...prev, message]);
    });

    socketIo.on('complaint_update', (updatedComp: any) => {
      setComplaints((prev) =>
        prev.map((c) => (c.id === updatedComp.id ? { ...c, status: updatedComp.status, notes: updatedComp.notes } : c))
      );
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compForm.description) return;
    setRaisingComp(true);
    setCompSuccess('');

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(compForm)
      });
      if (res.ok) {
        const newComp = await res.json();
        setComplaints(prev => [newComp, ...prev]);
        setCompSuccess('Complaint submitted successfully!');
        setCompForm({ category: 'INTERNET', description: '' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRaisingComp(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !socket || !profile) return;
    
    const userRoom = `chat_${profile.id}`;
    socket.emit('send_message', {
      room: userRoom,
      text: chatInput,
      sender: 'STUDENT'
    });

    setChatInput('');

    // Mock an admin response after 1.5s for demonstration
    setTimeout(() => {
      socket.emit('send_message', {
        room: userRoom,
        text: "Thanks for lodging this inquiry. Our helper executive is reviewing this logs and will update you shortly.",
        sender: 'SUPPORT'
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <RefreshCw className="w-10 h-10 text-secondary mx-auto animate-spin mb-4" />
        <span className="text-sm font-semibold text-neutral-400">Loading student workspace...</span>
      </div>
    );
  }

  const student = profile?.studentProfile;
  const room = student?.room;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
        <div className="space-y-2 relative">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">Student Portal</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Welcome back, {profile.name}!</h1>
          <p className="text-sm text-white/80">
            {room ? `Allotted: Room ${room.roomNumber} (${student.bedNumber}) • Floor ${room.floor}` : 'Registration pending room selection.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: ID Card & Room Details */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Digital Hostel ID Card */}
          {room ? (
            <div className="glass-card rounded-3xl p-6 border border-white/60 shadow-xl relative overflow-hidden bg-gradient-to-b from-white to-neutral-50 flex flex-col justify-between h-[420px] max-w-sm mx-auto group hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                <Logo size="sm" showText={false} />
                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Identity Active</span>
              </div>

              <div className="flex items-center space-x-4 my-6">
                {/* Simulated profile photo */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img src={student.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} alt="Student profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-800 text-lg">{profile.name}</h3>
                  <span className="text-xs text-neutral-400 block font-semibold">{student.course || 'B.Tech CS'} • {student.year || '1st Year'}</span>
                  <span className="text-xs text-neutral-500 block font-semibold">ID: {student.studentId || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-3 bg-white/70 p-4 rounded-2xl border border-neutral-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-semibold">Room / Bed:</span>
                  <span className="font-bold text-neutral-700">Room {room.roomNumber} ({student.bedNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-semibold">Blood Group:</span>
                  <span className="font-bold text-neutral-700">{student.bloodGroup || 'O+'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-semibold">Emergency Call:</span>
                  <span className="font-bold text-neutral-700">{student.emergencyContact || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <QrCode className="w-8 h-8 text-neutral-400" />
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">HMR ID barcode</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 text-center space-y-4 shadow-sm">
              <AlertCircle className="w-10 h-10 text-warning mx-auto" />
              <h4 className="font-bold text-neutral-700">No Room Allotted</h4>
              <p className="text-xs text-neutral-400">Complete room checkout to view digital ID card.</p>
              <button onClick={() => router.push('/book')} className="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl">Book Room</button>
            </div>
          )}

          {/* Billing & Invoice Receipt List */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-neutral-800 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-secondary" />
              <span>Billing & Payments</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-neutral-700">Semester Hostel Fees</div>
                  <div className="text-neutral-400 mt-0.5">Paid via Razorpay UPI</div>
                </div>
                <button onClick={() => window.print()} className="p-2 bg-white rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-all">
                  <Download className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Center/Right Column: Complaints center & Announcements */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Announcements Banner */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-neutral-800 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-warning" />
              <span>Hostel Announcements</span>
            </h3>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-2">
                  <h4 className="font-bold text-sm text-neutral-800">{ann.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{ann.content}</p>
                  <span className="text-[10px] text-neutral-400 block font-semibold">Published by {ann.createdBy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complaints Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Raise Complaint Form */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg text-neutral-800">Raise maintenance ticket</h3>
              
              {compSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-bold">
                  {compSuccess}
                </div>
              )}

              <form onSubmit={handleRaiseComplaint} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={compForm.category}
                    onChange={e => setCompForm({ ...compForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                  >
                    <option value="INTERNET">Wi-Fi & Internet</option>
                    <option value="ELECTRICITY">Electricity & Lighting</option>
                    <option value="WATER">Water Supply & RO</option>
                    <option value="CLEANING">Housekeeping & Cleaning</option>
                    <option value="MESS">Mess Food Quality</option>
                    <option value="FURNITURE">Bed/Study Table Damage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Issue Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details about the issue..."
                    value={compForm.description}
                    onChange={e => setCompForm({ ...compForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-secondary bg-white text-sm text-neutral-800"
                  />
                </div>
                <button
                  type="submit"
                  disabled={raisingComp}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                >
                  {raisingComp ? 'Submitting...' : 'File Ticket'}
                </button>
              </form>
            </div>

            {/* Complaints list tracking */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg text-neutral-800">Complaint Status Log</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
                {complaints.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs">No active complaints logged.</div>
                ) : (
                  complaints.map((c) => (
                    <div key={c.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-800 uppercase tracking-wide">{c.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-secondary' : 'bg-emerald-100 text-accent-dark'}`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-neutral-500 leading-normal">{c.description}</p>
                      {c.notes && (
                        <div className="bg-white p-2 rounded-xl border border-neutral-100 text-[10px] text-neutral-400 italic">
                          Admin note: {c.notes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Real-time support chat widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl border border-neutral-200/80 overflow-hidden flex flex-col justify-between animate-fade-in">
            {/* Header */}
            <div className="bg-secondary p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-extrabold text-sm">HMR Chat Support</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white hover:text-neutral-200 font-bold text-sm">✕</button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar text-xs">
              {chatMessages.map((msg) => {
                const isStudent = msg.sender === 'STUDENT';
                return (
                  <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${isStudent ? 'bg-secondary text-white rounded-tr-none' : 'bg-neutral-50 border border-neutral-100 text-neutral-700 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-neutral-100 flex items-center space-x-2 bg-neutral-50">
              <input
                type="text"
                placeholder="Type message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
              <button onClick={handleSendMessage} className="p-2 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-secondary hover:bg-secondary-dark text-white rounded-full p-4 shadow-xl flex items-center space-x-2 hover:scale-105 transition-all"
          >
            <PhoneCall className="w-5 h-5" />
            <span className="font-bold text-xs pr-1">Chat Support</span>
          </button>
        )}
      </div>

    </div>
  );
}
