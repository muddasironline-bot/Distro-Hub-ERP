import React, { useState } from 'react';
import { 
  Store, 
  User, 
  MapPin, 
  Smartphone, 
  DollarSign, 
  Plus, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Search, 
  Check, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { Shop, Route } from '../types';

interface CustomerProps {
  shops: Shop[];
  routes: Route[];
  setShops: React.Dispatch<React.SetStateAction<Shop[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function CustomerManagement({ 
  shops, 
  routes, 
  setShops, 
  logAudit 
}: CustomerProps) {
  
  // Tabs: directory vs induction requests
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'inductions'>('directory');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState('All');

  // New Shop Form state
  const [showShopModal, setShowShopModal] = useState(false);
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [formShop, setFormShop] = useState<Shop>({
    id: '',
    shopName: '',
    ownerName: '',
    mobile: '',
    address: '',
    latitude: 33.6425,
    longitude: 73.0784,
    geoRadius: 50,
    creditLimit: 50000,
    outstandingBalance: 0,
    routeId: 'R-1',
    status: 'Approved'
  });

  // Approved shop directories
  const approvedShopsList = shops.filter(s => s.status === 'Approved');
  const pendingInductionsList = shops.filter(s => s.status === 'Pending');

  // Open Form for Create
  const openCreateShop = () => {
    setIsEditingShop(false);
    setFormShop({
      id: 'S-' + (shops.length + 1),
      shopName: '',
      ownerName: '',
      mobile: '',
      address: '',
      latitude: 33.6 + Math.random() * 0.1,
      longitude: 73.0 + Math.random() * 0.1,
      geoRadius: 50,
      creditLimit: 50000,
      outstandingBalance: 0,
      routeId: routes[0]?.id || '',
      status: 'Approved'
    });
    setShowShopModal(true);
  };

  // Open Form for Edit
  const openEditShop = (shop: Shop) => {
    setIsEditingShop(true);
    setFormShop({ ...shop });
    setShowShopModal(true);
  };

  // Save Shop Action
  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formShop.shopName.trim()) return;

    if (isEditingShop) {
      setShops(prev => prev.map(s => s.id === formShop.id ? { ...formShop } : s));
      logAudit(`Modified Shop information: ${formShop.shopName} (${formShop.id})`, 'Customer Management');
    } else {
      setShops(prev => [...prev, { ...formShop }]);
      logAudit(`Directly induced new shop: ${formShop.shopName} (${formShop.id})`, 'Customer Management');
    }

    setShowShopModal(false);
  };

  // Approve Induction Request
  const handleApproveInduction = (id: string) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
    const sName = shops.find(s => s.id === id)?.shopName || id;
    logAudit(`Approved Mobile Shop Induction: "${sName}" (${id}). Enrolled in route cycle.`, 'Customer Management');
    alert(`Induction approved. "${sName}" is now active and assigned to its route compliance schedule.`);
  };

  // Reject Induction Request
  const handleRejectInduction = (id: string) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
    const sName = shops.find(s => s.id === id)?.shopName || id;
    logAudit(`Rejected Mobile Shop Induction request: "${sName}" (${id})`, 'Customer Management');
  };

  // Directory filter search logic
  const filteredShops = approvedShopsList.filter(s => {
    const matchesSearch = s.shopName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.mobile.includes(searchQuery);
    const matchesRoute = routeFilter === 'All' || s.routeId === routeFilter;
    return matchesSearch && matchesRoute;
  });

  return (
    <div className="space-y-6" id="customers-module">
      {/* Upper Navigation and counts */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Sub-tab Switchers */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'directory' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Shops Directory ({approvedShopsList.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('inductions')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all relative ${
              activeSubTab === 'inductions' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Shop Inductions ({pendingInductionsList.length})
            {pendingInductionsList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                {pendingInductionsList.length}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'directory' && (
          <button 
            onClick={openCreateShop}
            className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Add Shop Profile
          </button>
        )}
      </div>

      {/* VIEW 1: Directory List */}
      {activeSubTab === 'directory' && (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search shops by shop name, owner, or mobile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="w-full md:w-64">
              <select 
                value={routeFilter}
                onChange={e => setRouteFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2.5 w-full text-sm focus:outline-none"
              >
                <option value="All">All Route Sectors</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm border-collapse" id="shops-directory-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-xs">
                  <th className="p-4 uppercase">ID</th>
                  <th className="p-4 uppercase">Shop / Outlet Details</th>
                  <th className="p-4 uppercase">Owner &amp; Phone</th>
                  <th className="p-4 uppercase">Geofence (Radius)</th>
                  <th className="p-4 uppercase">Assigned Beat Route</th>
                  <th className="p-4 uppercase">Outstanding Balance</th>
                  <th className="p-4 uppercase">Credit Limit</th>
                  <th className="p-4 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredShops.length > 0 ? (
                  filteredShops.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-400">{s.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          <Store className="h-4 w-4 text-slate-400 shrink-0" />
                          {s.shopName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" /> {s.address}
                        </div>
                      </td>
                      <td className="p-4 text-slate-700">
                        <div className="font-semibold flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {s.ownerName}
                        </div>
                        <div className="font-mono text-slate-400 mt-0.5">{s.mobile}</div>
                      </td>
                      <td className="p-4 font-mono">
                        <span className="font-bold text-indigo-700">r={s.geoRadius}m</span>
                        <div className="text-[10px] text-slate-400">Lat: {s.latitude.toFixed(4)}, Lng: {s.longitude.toFixed(4)}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded">
                          {routes.find(r => r.id === s.routeId)?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono font-bold ${s.outstandingBalance > s.creditLimit ? 'text-rose-600' : s.outstandingBalance > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                          PKR {s.outstandingBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-700 font-semibold">
                        PKR {s.creditLimit.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => openEditShop(s)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-all"
                          title="Edit Shop Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No matching registered shops found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Pending Induction Requests */}
      {activeSubTab === 'inductions' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-900 text-base">Order Booker Remote Inductions Queue</h4>
            <p className="text-xs text-slate-400">
              When an Order Booker visits a new retail shop on the field, they submit registration parameters. Admin verification is required before enrollment.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="inductions-list">
            {pendingInductionsList.length > 0 ? (
              pendingInductionsList.map(req => (
                <div 
                  key={req.id} 
                  className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Pending Vetting
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{req.shopName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-0.5 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" /> {req.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-150 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Owner Vitals</span>
                      <span className="font-bold text-slate-800">{req.ownerName}</span>
                      <span className="text-[11px] block font-mono text-slate-500 mt-0.5">{req.mobile}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Requested Line Limit</span>
                      <span className="font-bold text-slate-800">PKR {req.creditLimit.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Approved Geo Radius: {req.geoRadius}m</span>
                    </div>
                  </div>

                  {/* Geolocation Compliance Block */}
                  <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <div>
                      <span className="font-bold">GPS Geofence Match Checked:</span> GPS coords match physical address logs. Radial fence boundary is set to 50 meters.
                    </div>
                  </div>

                  {/* Vetting Action Trigger buttons */}
                  <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => handleRejectInduction(req.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1 border border-rose-100 transition-all"
                    >
                      <XCircle className="h-4 w-4" /> Decline Shop
                    </button>
                    <button 
                      onClick={() => handleApproveInduction(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1 transition-all shadow-xs"
                    >
                      <CheckCircle className="h-4 w-4" /> Enroll &amp; Assign Route
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="xl:col-span-2 bg-white border border-slate-100 rounded-xl p-12 text-center text-slate-400">
                <Store className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h5 className="font-bold text-slate-700">Inductions Queue Empty</h5>
                <p className="text-xs text-slate-400 mt-1">
                  No pending field shop enrollment requests are currently logged.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHOP ADD / EDIT MODAL */}
      {showShopModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">
                {isEditingShop ? 'Edit Shop Profile' : 'Direct Induct Shop Profile'}
              </h4>
              <button onClick={() => setShowShopModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShop} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Shop Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Bismillah General Store"
                    value={formShop.shopName}
                    onChange={e => setFormShop(prev => ({ ...prev, shopName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Owner Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Muhammad Bilal"
                    value={formShop.ownerName}
                    onChange={e => setFormShop(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Contact Mobile *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 0300-1234567"
                    value={formShop.mobile}
                    onChange={e => setFormShop(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Assign Route Sector</label>
                  <select 
                    value={formShop.routeId}
                    onChange={e => setFormShop(prev => ({ ...prev, routeId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Physical Address *</label>
                <textarea 
                  required
                  placeholder="Street No, Area, Sector, Rawalpindi"
                  value={formShop.address}
                  onChange={e => setFormShop(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  rows={2}
                />
              </div>

              {/* Geo location specifications */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Latitude</label>
                  <input 
                    type="number" 
                    step="0.000001"
                    value={formShop.latitude}
                    onChange={e => setFormShop(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Longitude</label>
                  <input 
                    type="number" 
                    step="0.000001"
                    value={formShop.longitude}
                    onChange={e => setFormShop(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Fence Radius (m)</label>
                  <input 
                    type="number" 
                    value={formShop.geoRadius}
                    onChange={e => setFormShop(prev => ({ ...prev, geoRadius: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-bold text-indigo-700"
                    min={10}
                    max={200}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Authorized Credit Limit (PKR)</label>
                  <input 
                    type="number" 
                    value={formShop.creditLimit}
                    onChange={e => setFormShop(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold text-slate-700"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Outstanding Balance (PKR)</label>
                  <input 
                    type="number" 
                    value={formShop.outstandingBalance}
                    onChange={e => setFormShop(prev => ({ ...prev, outstandingBalance: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold text-rose-700"
                    min={0}
                  />
                </div>
              </div>

              {/* Form submit/discard buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowShopModal(false)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Save Shop Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
