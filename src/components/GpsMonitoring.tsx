import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  Activity, 
  Navigation, 
  Clock, 
  RefreshCw, 
  Layers 
} from 'lucide-react';
import { GpsLog } from '../types';

interface GpsProps {
  gpsLogs: GpsLog[];
}

export default function GpsMonitoring({ gpsLogs }: GpsProps) {
  
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [isSimulating, setIsSimulating] = useState(true);

  const selectedRep = gpsLogs.find(g => g.id === selectedRepId) || gpsLogs[0];

  return (
    <div className="space-y-6" id="gps-monitoring-panel">
      {/* Title block */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
            GPS Monitoring &amp; Compliance Center
          </h3>
          <p className="text-xs text-slate-500">
            Monitor real-time active locations, geofence compliance, and visit durations of Order Bookers and Supply Men.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Tracking
          </span>
          <button 
            onClick={() => alert("Re-pinging all active mobile SFA satellites...")}
            className="p-1.5 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-ping
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Live Field Operators List */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm">Active Representatives</h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-extrabold px-2 py-0.5 rounded-full">
              {gpsLogs.length} Representatives
            </span>
          </div>

          <div className="space-y-3" id="gps-reps-list">
            {gpsLogs.map(g => (
              <div 
                key={g.id}
                onClick={() => setSelectedRepId(g.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                  selectedRep.id === g.id 
                    ? 'border-indigo-500 bg-indigo-50/20' 
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{g.employeeName}</h5>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{g.role} ({g.employeeId})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Current Retailer</span>
                    <span className="font-semibold text-slate-800 truncate block">{g.currentShop}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Visit Time</span>
                    <span className="font-semibold text-slate-800">{g.visitDuration}</span>
                  </div>
                </div>

                {/* Progress compliance bar */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400 font-medium">Route Beat Progress</span>
                    <span className="font-bold text-indigo-700">{g.routeProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${g.routeProgress}%` }}
                    />
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                  Pinged {g.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side 2 Columns: GPS Satellite Map & Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Canvas Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Navigation className="h-4 w-4 text-indigo-600" />
                <span>Focusing on: {selectedRep?.employeeName || 'Rep'} ({selectedRep?.employeeId || 'ID'})</span>
              </div>
              
              {/* Map Type Controls */}
              <div className="flex bg-slate-100 p-1 rounded-lg text-[10px] font-bold">
                <button 
                  onClick={() => setMapType('streets')}
                  className={`px-2.5 py-1 rounded ${mapType === 'streets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  Streets
                </button>
                <button 
                  onClick={() => setMapType('satellite')}
                  className={`px-2.5 py-1 rounded ${mapType === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  Satellite
                </button>
                <button 
                  onClick={() => setMapType('terrain')}
                  className={`px-2.5 py-1 rounded ${mapType === 'terrain' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  Terrain
                </button>
              </div>
            </div>

            {/* Simulated Live Map Canvas */}
            <div className="h-96 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
              
              {/* Retro digital grid/line background */}
              <div className="absolute inset-0 opacity-10" 
                   style={{ 
                     backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)', 
                     backgroundSize: '24px 24px' 
                   }} 
              />

              {/* Vector mock map paths representing Satellite map or Street map */}
              <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 800 500">
                <path d="M50 200 L750 200 M200 50 L200 450 M450 50 L450 450 M100 100 Q 300 150 500 100 T 700 200" stroke="#334155" strokeWidth="2" fill="none" />
                <path d="M100 350 L700 350 M300 50 L300 450 M600 50 L600 450" stroke="#334155" strokeWidth="1.5" fill="none" />
                
                {/* Geofence area representations around shops */}
                <circle cx="300" cy="200" r="50" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="450" cy="350" r="40" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="100" r="60" fill="#f59e0b" fillOpacity="0.08" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
              </svg>

              {/* Map Markers */}
              {gpsLogs.map((g, idx) => {
                // Determine offset placements for mock simulation
                const cx = idx === 0 ? 300 : idx === 1 ? 450 : 200;
                const cy = idx === 0 ? 200 : idx === 1 ? 350 : 100;
                const isFocused = selectedRep.id === g.id;

                return (
                  <div 
                    key={g.id} 
                    className="absolute"
                    style={{ left: `${cx}px`, top: `${cy}px` }}
                  >
                    {/* Geofence Compliance Circle Radar */}
                    {isFocused && (
                      <div className="absolute -left-12 -top-12 h-28 w-28 rounded-full bg-indigo-500/10 border border-indigo-500/40 animate-ping" style={{ animationDuration: '3s' }} />
                    )}

                    {/* Physical Pin */}
                    <div className="relative cursor-pointer group flex flex-col items-center">
                      <div className={`p-1.5 rounded-full border shadow-sm ${
                        isFocused ? 'bg-indigo-600 text-white border-white' : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        <MapPin className="h-5.5 w-5.5" />
                      </div>
                      
                      {/* Name Card above pin */}
                      <div className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-black tracking-wide whitespace-nowrap shadow-sm ${
                        isFocused ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300'
                      }`}>
                        {g.employeeName}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coordinates Info Box */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 text-white text-[10px] font-mono p-3 rounded-xl shadow-md space-y-1">
                <div className="font-bold text-slate-400 uppercase tracking-wider">GPS Satellite Position</div>
                <div>ID: {selectedRep.employeeId}</div>
                <div>Lat: {selectedRep.latitude.toFixed(6)} N</div>
                <div>Lng: {selectedRep.longitude.toFixed(6)} E</div>
                <div>Compliance Check: <span className="text-emerald-400 font-bold">PASS (Inside Geofence)</span></div>
              </div>

              {/* Map controls */}
              <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-[10px] text-slate-300 font-bold space-y-1.5 shadow-md">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>GPS Receiver OK</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span>SFA Sync Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
