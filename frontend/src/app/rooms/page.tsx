'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { API_BASE, SOCKET_BASE } from '../../lib/clientState';
import { Bed, Users, Wifi, Compass, ArrowRight, ShieldCheck, RefreshCcw } from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  category: string;
  floor: number;
  capacity: number;
  occupancy: number;
  availableBeds: number;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  studyTables: number;
  chairs: number;
  cupboards: number;
  hasBathroom: boolean;
  hasWifi: boolean;
  images: string[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Setup Socket.io real-time connection
    const socket = io(SOCKET_BASE);

    socket.on('connect', () => {
      console.log('🔌 Connected to websocket server from Rooms Page');
    });

    socket.on('room_update', (updatedData: any) => {
      console.log('📡 Real-time Room Update Received:', updatedData);
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedData.roomId
            ? {
                ...room,
                status: updatedData.status,
                occupancy: updatedData.occupancy,
                availableBeds: updatedData.availableBeds,
              }
            : room
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filtering
  const filteredRooms = rooms.filter((room) => {
    const matchCat = filterCategory === 'All' || room.category === filterCategory;
    const matchStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Available' && room.status === 'AVAILABLE') ||
      (filterStatus === 'Occupied' && room.status === 'OCCUPIED') ||
      (filterStatus === 'Maintenance' && room.status === 'MAINTENANCE');
    return matchCat && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h1 className="text-4xl font-extrabold text-neutral-800 tracking-tight">Our Rooms & Availability</h1>
        <p className="text-neutral-400 font-medium text-sm">
          Browse rooms in real-time. Check capacity, furniture inventory, and book directly.
        </p>
      </div>

      {/* Filters Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 p-4 bg-white rounded-2xl border border-neutral-200/50 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2">Category:</span>
          {['All', 'Single Seater', '2 Seater', '3 Seater'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCategory === cat ? 'bg-secondary text-white shadow-sm shadow-secondary/20' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2">Status:</span>
          {['All', 'Available', 'Occupied', 'Maintenance'].map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === stat ? 'bg-secondary text-white shadow-sm' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'}`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-neutral-100 rounded-3xl h-[420px] p-6 space-y-6">
              <div className="bg-neutral-200 h-40 rounded-2xl w-full" />
              <div className="bg-neutral-200 h-6 rounded w-1/3" />
              <div className="bg-neutral-200 h-10 rounded w-2/3" />
              <div className="bg-neutral-200 h-12 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
          <RefreshCcw className="w-12 h-12 text-neutral-300 mx-auto mb-4 animate-spin-slow" />
          <h3 className="font-extrabold text-neutral-700">No Matching Rooms Found</h3>
          <p className="text-xs text-neutral-400 mt-1">Try resetting the filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => {
            const isFull = room.occupancy >= room.capacity || room.status === 'OCCUPIED';
            const isMaintenance = room.status === 'MAINTENANCE';
            const onlyOneLeft = room.capacity - room.occupancy === 1 && room.capacity > 1;

            return (
              <div
                key={room.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm transition-all duration-300 flex flex-col justify-between ${isFull ? 'opacity-85 border-neutral-200 bg-neutral-50/50' : 'border-neutral-100 hover:border-secondary/20 hover:shadow-lg'}`}
              >
                {/* Visual Image / Category Indicator */}
                <div className="relative h-44 overflow-hidden bg-neutral-100">
                  <img
                    src={room.images[0] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop'}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-xl shadow-sm text-xs font-bold text-neutral-800">
                    Floor {room.floor}
                  </div>

                  <div className="absolute top-4 right-4">
                    {isMaintenance ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-xl text-xs font-bold shadow-sm">Maintenance</span>
                    ) : isFull ? (
                      <span className="bg-neutral-200 text-neutral-600 px-3 py-1 rounded-xl text-xs font-bold shadow-sm">Fully Occupied</span>
                    ) : onlyOneLeft ? (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-xl text-xs font-extrabold shadow-md animate-pulse">Only 1 Bed Left!</span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-xs font-bold shadow-sm">Available</span>
                    )}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-2xl text-neutral-800">Room {room.roomNumber}</h3>
                      <p className="text-xs text-neutral-400 font-bold">{room.category} Sharing</p>
                    </div>
                    <div className="text-right">
                       <span className="text-xl font-extrabold text-secondary">₹{room.price >= 100000 ? `${(room.price / 100000).toFixed(2)} Lakh` : room.price}</span>
                       <span className="text-xs text-neutral-400 block -mt-1 font-semibold">/annum</span>
                     </div>
                  </div>

                  {/* Bed Allocation Indicator */}
                  <div className="flex items-center space-x-1.5 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <Users className="w-4 h-4 text-neutral-400 mr-1" />
                    <span className="text-xs text-neutral-500 font-bold">Beds:</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: room.capacity }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full border ${i < room.occupancy ? 'bg-secondary border-secondary-dark' : 'bg-white border-neutral-300'}`}
                          title={i < room.occupancy ? 'Occupied Bed' : 'Available Bed'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400 ml-auto font-medium">({room.occupancy}/{room.capacity} occupied)</span>
                  </div>

                  {/* Furniture specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 font-semibold pt-1">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>Attached Bath</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Wifi className="w-3.5 h-3.5 text-accent" />
                      <span>Wi-Fi Enabled</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Bed className="w-3.5 h-3.5 text-accent" />
                      <span>{room.studyTables} Study Table(s)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Compass className="w-3.5 h-3.5 text-accent" />
                      <span>Individual Lockers</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0">
                  {isMaintenance || isFull ? (
                    <button
                      disabled
                      className="w-full bg-neutral-200 text-neutral-400 font-bold py-3.5 rounded-2xl text-center text-sm cursor-not-allowed border border-neutral-300/30"
                    >
                      {isMaintenance ? 'Under Maintenance' : 'Fully Occupied'}
                    </button>
                  ) : (
                    <Link
                      href={`/book?roomNumber=${room.roomNumber}&roomId=${room.id}&category=${encodeURIComponent(room.category)}`}
                      className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-2xl text-center text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
                    >
                      <span>Book Room {room.roomNumber}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
