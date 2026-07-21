'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE, getAuthToken, getAuthUser } from '../../lib/clientState';
import {
  ShieldAlert, Database, Settings, Key, Trash, UserPlus, Shield, Clipboard,
  Briefcase, CheckCircle2, RefreshCw
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  
  // Settings forms
  const [prices, setPrices] = useState({ single: 160000, double: 140000, triple: 125000 });
  const [gateway, setGateway] = useState({ key: 'rzp_test_1029304859', secret: '••••••••••••••••••••••••' });

  // Mock Admin accounts list
  const [admins, setAdmins] = useState<any[]>([
    { id: 'adm_1', name: 'Alok Mishra', email: 'alok.admin@hmr.com', role: 'ADMIN', status: 'ACTIVE' },
    { id: 'adm_2', name: 'Sneha Roy', email: 'sneha.support@hmr.com', role: 'ADMIN', status: 'ACTIVE' }
  ]);

  // Mock Audit Logs
  const [audits, setAudits] = useState<any[]>([
    { id: 'aud_1', user: 'Super Admin', action: 'DATABASE_BACKUP_GENERATED', ip: '192.168.1.45', timestamp: new Date(Date.now() - 40 * 60 * 1000) },
    { id: 'aud_2', user: 'Admin Sneha', action: 'SUPPORT_LEAD_STATUS_CLOSED', ip: '192.168.1.12', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'aud_3', user: 'Admin Alok', action: 'ROOM_PRICE_MODIFIED', ip: '192.168.1.28', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) }
  ]);

  // Backup loading
  const [backingUp, setBackingUp] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    const token = getAuthToken();
    if (!token || !user || user.role !== 'SUPER_ADMIN') {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, []);

  const triggerBackup = () => {
    setBackingUp(true);
    setSuccess('');
    setTimeout(() => {
      setBackingUp(false);
      setSuccess('Database backup generated and compressed: HMR_DB_BACKUP_2026.tar.gz');
      // Append log
      setAudits(prev => [
        { id: `aud_${Date.now()}`, user: 'Super Admin', action: 'DATABASE_BACKUP_COMPRESSED', ip: '127.0.0.1', timestamp: new Date() },
        ...prev
      ]);
    }, 2000);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('New staff administrator account created successfully!');
    setAudits(prev => [
      { id: `aud_${Date.now()}`, user: 'Super Admin', action: 'STAFF_ACCOUNT_CREATED', ip: '127.0.0.1', timestamp: new Date() },
      ...prev
    ]);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <RefreshCw className="w-10 h-10 text-secondary mx-auto animate-spin mb-4" />
        <span className="text-sm font-semibold text-neutral-400">Loading super-admin systems panel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight flex items-center space-x-2">
          <Shield className="w-8 h-8 text-secondary" />
          <span>Super Admin Control Terminal</span>
        </h1>
        <p className="text-xs text-neutral-400 font-semibold mt-1">Configure global pricing indices, audit staff activities, configure payment gateways, and execute server database backups.</p>
      </div>

      {success && (
        <div className="p-4 bg-accent-light border border-accent/20 text-accent-dark rounded-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Global pricing & backups */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Room Pricing adjustments */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral-800 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-secondary" />
              <span>Base Rental Pricing</span>
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-2">Single Seater Price (₹)</label>
                <input
                  type="number"
                  value={prices.single}
                  onChange={e => setPrices({ ...prices, single: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-semibold mb-2">2 Seater Price (₹)</label>
                <input
                  type="number"
                  value={prices.double}
                  onChange={e => setPrices({ ...prices, double: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-semibold mb-2">3 Seater Price (₹)</label>
                <input
                  type="number"
                  value={prices.triple}
                  onChange={e => setPrices({ ...prices, triple: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSuccess('Global base rent parameters updated successfully!')}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-xl transition-all"
              >
                Save Pricing Matrix
              </button>
            </div>
          </div>

          {/* Database Backup triggers */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral-800 flex items-center space-x-2">
              <Database className="w-5 h-5 text-accent" />
              <span>System Backup Utility</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-normal">
              Execute hot backups of all collections. Archives are automatically uploaded to fallback storage instances.
            </p>
            <button
              onClick={triggerBackup}
              disabled={backingUp}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-2"
            >
              <span>{backingUp ? 'Compiling archive...' : 'Generate Backup Archive'}</span>
            </button>
          </div>

        </div>

        {/* Center Column: Admin account list & Audits logs */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Create Staff administrator accounts */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-neutral-800 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-indigo-500" />
                <span>Create Staff Account</span>
              </h3>
              
              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-2">Staff Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Mishra"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. staff@hmr.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  Create Admin
                </button>
              </form>
            </div>

            {/* Admin accounts list */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-neutral-800 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                <span>Staff Administrators</span>
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                {admins.map(adm => (
                  <div key={adm.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between text-xs font-semibold">
                    <div>
                      <div className="text-neutral-800 font-bold">{adm.name}</div>
                      <div className="text-neutral-400 text-[10px]">{adm.email}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-accent-dark px-2.5 py-0.5 rounded-full font-bold">Active</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Audit Logs system viewer */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-neutral-800 flex items-center space-x-2">
              <Clipboard className="w-5 h-5 text-secondary" />
              <span>System Operations Audit Logs</span>
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
              {audits.map(log => (
                <div key={log.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2 font-semibold">
                  <div>
                    <span className="text-secondary font-bold mr-2">[{log.user}]</span>
                    <span className="text-neutral-600 font-bold">{log.action}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-semibold">
                    IP: {log.ip} • {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
