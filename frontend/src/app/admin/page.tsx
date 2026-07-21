'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { API_BASE, SOCKET_BASE, getAuthToken, getAuthUser } from '../../lib/clientState';
import {
  TrendingUp, Users, AlertCircle, Wrench, BadgeAlert, Plus, Edit2, Trash,
  PhoneCall, ShieldCheck, Mail, RefreshCw, MessageSquare, Clipboard, Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview'); // overview, rooms, bookings, complaints, leads
  
  // Dashboard Data
  const [stats, setStats] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  
  // Loading
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Room Form Modal state
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '', category: 'Single Seater', floor: 1, capacity: 1, price: 8500,
    studyTables: 1, chairs: 1, cupboards: 1, hasBathroom: true, hasWifi: true
  });

  // Call Dialer Modal state
  const [dialingStudent, setDialingStudent] = useState<any>(null);
  const [callStatus, setCallStatus] = useState('ringing');

  // Announcement publisher Form state
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [annSuccess, setAnnSuccess] = useState('');

  const fetchAdminData = async () => {
    try {
      setSyncing(true);
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      // 1. Fetch Stats
      const statsRes = await fetch(`${API_BASE}/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        router.push('/login');
        return;
      }

      // 2. Fetch Rooms
      const roomsRes = await fetch(`${API_BASE}/rooms`);
      if (roomsRes.ok) setRooms(await roomsRes.json());

      // 3. Fetch Bookings
      const bookingsRes = await fetch(`${API_BASE}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsRes.ok) setBookings(await bookingsRes.json());

      // 4. Fetch Complaints
      const complaintsRes = await fetch(`${API_BASE}/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (complaintsRes.ok) setComplaints(await complaintsRes.json());

      // 5. Fetch Leads
      const leadsRes = await fetch(`${API_BASE}/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (leadsRes.ok) setLeads(await leadsRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();

    // Setup Socket.io real-time updates for support inquiries and notifications
    const socket = io(SOCKET_BASE);

    socket.on('connect', () => {
      console.log('🔌 Connected to websocket from Admin Panel');
    });

    socket.on('new_lead', (newLead: any) => {
      console.log('📡 Real-time support lead received:', newLead);
      setLeads((prevLeads) => {
        const exists = prevLeads.find((l) => l.id === newLead.id || l.email === newLead.email);
        if (exists) {
          return prevLeads.map((l) => (l.id === newLead.id || l.email === newLead.email ? newLead : l));
        }
        return [newLead, ...prevLeads];
      });
    });

    socket.on('room_update', (updatedRoom: any) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedRoom.roomId ? { ...room, occupancy: updatedRoom.occupancy, status: updatedRoom.status } : room
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomForm)
      });
      if (res.ok) {
        const newRoom = await res.json();
        setRooms(prev => [newRoom, ...prev]);
        setShowAddRoom(false);
        setRoomForm({
          roomNumber: '', category: 'Single Seater', floor: 1, capacity: 1, price: 8500,
          studyTables: 1, chairs: 1, cupboards: 1, hasBathroom: true, hasWifi: true
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRoomStatus = async (roomId: string, currentStatus: string) => {
    const token = getAuthToken();
    const nextStatus = currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      const res = await fetch(`${API_BASE}/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updatedRoom = await res.json();
        setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    const token = getAuthToken();
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      const res = await fetch(`${API_BASE}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRooms(prev => prev.filter(r => r.id !== roomId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateComplaint = async (compId: string, nextStatus: string) => {
    const token = getAuthToken();
    const resolutionNotes = nextStatus === 'COMPLETED' ? 'Resolved by maintenance staff' : 'Assigned electrician to evaluate wiring';
    try {
      const res = await fetch(`${API_BASE}/complaints/${compId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus, notes: resolutionNotes })
      });
      if (res.ok) {
        const updatedComp = await res.json();
        setComplaints(prev => prev.map(c => c.id === compId ? updatedComp : c));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, nextStatus: string) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus, assignedTo: 'Executive Agent 1' })
      });
      if (res.ok) {
        const updatedLead = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updatedLead : l));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) return;
    const token = getAuthToken();
    setAnnSuccess('');

    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(announcementForm)
      });
      if (res.ok) {
        setAnnSuccess('Announcement published to student dashboards!');
        setAnnouncementForm({ title: '', content: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerCallSimulation = (student: any) => {
    setDialingStudent(student);
    setCallStatus('ringing');
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <RefreshCw className="w-10 h-10 text-secondary mx-auto animate-spin mb-4" />
        <span className="text-sm font-semibold text-neutral-400">Loading admin control terminal...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* Upper Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Admin Dashboard Workspace</h1>
          <p className="text-xs text-neutral-400 font-semibold mt-1">Manage room inventory, approvals, complaints and real-time leads.</p>
        </div>
        <button
          onClick={fetchAdminData}
          disabled={syncing}
          className="flex items-center space-x-2 border border-neutral-200 bg-white hover:bg-neutral-50 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-700 shadow-sm transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync Live Data'}</span>
        </button>
      </div>

      {/* Analytics widgets metrics */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <div className="text-xl font-extrabold text-neutral-800">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase">Gross Revenue</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-2">
            <Users className="w-5 h-5 text-accent" />
            <div className="text-xl font-extrabold text-neutral-800">{stats.occupiedBeds}/{stats.totalBeds}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase">Beds Occupancy</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <div className="text-xl font-extrabold text-neutral-800">{stats.occupiedRooms}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase">Occupied Rooms</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-2">
            <Plus className="w-5 h-5 text-teal-500" />
            <div className="text-xl font-extrabold text-neutral-800">{stats.totalBookings}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase">Total Reservations</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <div className="text-xl font-extrabold text-neutral-800">{stats.activeComplaints}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase">Active Tickets</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-2">
            <BadgeAlert className="w-5 h-5 text-purple-500" />
            <div className="text-xl font-extrabold text-neutral-800">{leads.filter(l => l.status === 'NEW_INQUIRY').length}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase">New Inquiries</div>
          </div>
        </div>
      )}

      {/* Tab panel selectors */}
      <div className="flex border-b border-neutral-200 max-w-lg">
        {['overview', 'rooms', 'bookings', 'complaints', 'leads'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-secondary text-neutral-800 font-extrabold' : 'border-transparent text-neutral-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* OVERVIEW GRAPH PAGE */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Monthly Revenue Custom Visual Bar Graph */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-neutral-800">Monthly Revenue Collection</h3>
            
            <div className="h-64 flex items-end justify-between px-4 pt-8">
              {stats.monthlyRevenue.map((pt: any, i: number) => {
                const maxAmt = Math.max(...stats.monthlyRevenue.map((p: any) => p.amount));
                const heightPercent = maxAmt > 0 ? (pt.amount / maxAmt) * 80 : 10;
                
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="text-[10px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                      ₹{(pt.amount/1000).toFixed(0)}k
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-10 sm:w-12 bg-secondary/80 hover:bg-secondary rounded-t-xl transition-all duration-500 shadow-sm"
                    />
                    <span className="text-xs text-neutral-500 font-bold mt-3">{pt.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick announcement publisher */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-base text-neutral-800 mb-2">Publish announcement</h3>
              <p className="text-xs text-neutral-400 font-semibold mb-6">Pushes real-time banner updates to student dashboards.</p>
              
              {annSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-bold">
                  {annSuccess}
                </div>
              )}

              <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Notice Title"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-secondary"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="Content details..."
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-secondary"
                />
                <button type="submit" className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-2.5 rounded-xl text-xs">
                  Publish Notice
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* ROOMS INVENTORY TAB */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-neutral-800">Rooms Database</h3>
            <button
              onClick={() => setShowAddRoom(true)}
              className="flex items-center space-x-1 bg-secondary text-white font-bold px-4 py-2.5 rounded-xl text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
          </div>

          {showAddRoom && (
            <form onSubmit={handleCreateRoom} className="bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-md grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in">
              <input
                type="text"
                placeholder="Room No."
                required
                value={roomForm.roomNumber}
                onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs"
              />
              <select
                value={roomForm.category}
                onChange={e => setRoomForm({ ...roomForm, category: e.target.value })}
                className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs bg-white"
              >
                <option value="Single Seater">Single Seater</option>
                <option value="2 Seater">2 Seater</option>
                <option value="3 Seater">3 Seater</option>
              </select>
              <input
                type="number"
                placeholder="Floor"
                required
                value={roomForm.floor}
                onChange={e => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
                className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs"
              />
              <input
                type="number"
                placeholder="Capacity"
                required
                value={roomForm.capacity}
                onChange={e => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs"
              />
              <input
                type="number"
                placeholder="Price/mo (₹)"
                required
                value={roomForm.price}
                onChange={e => setRoomForm({ ...roomForm, price: Number(e.target.value) })}
                className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs"
              />
              <button type="submit" className="bg-secondary text-white font-bold rounded-xl text-xs sm:col-span-3">
                Create Room
              </button>
            </form>
          )}

          {/* Table list */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-500">
                <thead className="bg-neutral-50 text-neutral-400 uppercase tracking-widest text-[10px] border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4">Room No.</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Floor</th>
                    <th className="px-6 py-4">Capacity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-semibold">
                  {rooms.map(room => (
                    <tr key={room.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4 text-neutral-800">Room {room.roomNumber}</td>
                      <td className="px-6 py-4">{room.category}</td>
                      <td className="px-6 py-4">Floor {room.floor}</td>
                      <td className="px-6 py-4">({room.occupancy || 0}/{room.capacity}) Beds</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${room.status === 'MAINTENANCE' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-800">₹{room.price}</td>
                      <td className="px-6 py-4 flex justify-center space-x-2">
                        <button
                          onClick={() => handleUpdateRoomStatus(room.id, room.status)}
                          className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600"
                          title="Toggle Maintenance Block"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 border border-danger-light rounded-xl hover:bg-danger/5 text-danger"
                          title="Delete Room"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LEADS WORKSPACE TAB */}
      {activeTab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Leads Board */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-extrabold text-base text-neutral-800">Real-Time Support Leads</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
              {leads.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 bg-white border border-neutral-100 rounded-2xl text-xs">No inquiry leads capture yet.</div>
              ) : (
                leads.map(lead => (
                  <div key={lead.id} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-secondary/20 transition-all">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-neutral-800">{lead.fullName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${lead.status === 'NEW_INQUIRY' ? 'bg-blue-100 text-secondary animate-pulse' : lead.status === 'CLOSED' ? 'bg-neutral-200 text-neutral-500' : 'bg-orange-100 text-orange-600'}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 font-semibold">
                        Phone: {lead.phone} • Preferred: {lead.preferredCategory}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-semibold mt-1">
                        Progress: <span className="text-secondary font-bold">{lead.bookingProgress}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => triggerCallSimulation(lead)}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                        title="Call Student Desk"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </button>
                      <select
                        value={lead.status}
                        onChange={e => handleUpdateLeadStatus(lead.id, e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-xl text-xs bg-white text-neutral-600 focus:outline-none"
                      >
                        <option value="NEW_INQUIRY">New Inquiry</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="CLOSED">Closed/Success</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Call Dialer simulator popup */}
          {dialingStudent && (
            <div className="lg:col-span-4 bg-neutral-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between h-80 animate-fade-in">
              <div className="space-y-4">
                <span className="text-[10px] bg-white/10 text-white/70 px-3 py-1 rounded-full font-bold">HMR Cloud Phone Dialer</span>
                <div className="pt-4 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PhoneCall className="w-6 h-6 text-emerald-400 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-sm">{dialingStudent.fullName}</h4>
                  <p className="text-xs text-white/50">{dialingStudent.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] text-white/30 text-center font-semibold">
                  Status: <span className="text-emerald-400 uppercase font-bold">{callStatus}</span>
                </div>
                <button
                  onClick={() => setDialingStudent(null)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  End Session
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* COMPLAINTS LOG TAB */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-base text-neutral-800">Student Complaints Board</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 bg-white border border-neutral-100 rounded-2xl text-xs col-span-2">No complaints active.</div>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4 hover:border-secondary/20 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-neutral-800 uppercase tracking-wide">{c.category} (Room {c.room?.roomNumber || 'N/A'})</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : c.status === 'IN_PROGRESS' ? 'bg-blue-50 text-secondary' : 'bg-emerald-50 text-accent-dark'}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-normal">{c.description}</p>
                    {c.student && (
                      <span className="text-[10px] text-neutral-400 block font-semibold">Logged by student: {c.student.phone}</span>
                    )}
                  </div>

                  {c.status !== 'COMPLETED' && (
                    <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => handleUpdateComplaint(c.id, 'IN_PROGRESS')}
                        className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-2 rounded-xl text-[10px] transition-all"
                      >
                        Set In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateComplaint(c.id, 'COMPLETED')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-[10px] transition-all"
                      >
                        Resolve Ticket
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* BOOKINGS VIEW TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-base text-neutral-800">All Reservations</h3>
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-500">
                <thead className="bg-neutral-50 text-neutral-400 uppercase tracking-widest text-[10px] border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Allotted Room</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Reserved Date</th>
                    <th className="px-6 py-4 text-center">QR receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-semibold">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4 text-secondary">{b.bookingId}</td>
                      <td className="px-6 py-4 text-neutral-800">{b.fullName}</td>
                      <td className="px-6 py-4">Room {b.room?.roomNumber || 'N/A'} ({b.bedNumber})</td>
                      <td className="px-6 py-4 text-emerald-600">{b.paymentStatus}</td>
                      <td className="px-6 py-4 text-neutral-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-600 px-2 py-0.5 rounded-lg">Verified</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
