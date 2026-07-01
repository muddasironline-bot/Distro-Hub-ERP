import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Users, 
  ArrowRight, 
  Plus, 
  Activity, 
  History, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Route, User, Shop, RouteHistory } from '../types';

interface RouteProps {
  routes: Route[];
  users: User[];
  shops: Shop[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  setShops: React.Dispatch<React.SetStateAction<Shop[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function RouteManagement({ 
  routes, 
  users, 
  shops, 
  setRoutes, 
  setShops, 
  logAudit 
}: RouteProps) {
  
  // States
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    area: '',
    beatPlan: 'Mon / Wed / Fri',
    assignedEmployeeId: ''
  });

  // Transfer Desk States
  const [transferMode, setTransferMode] = useState<'single' | 'bulk'>('single');
  const [selectedShopId, setSelectedShopId] = useState('');
  const [sourceRouteId, setSourceRouteId] = useState('');
  const [targetRouteId, setTargetRouteId] = useState('');

  // Historic logs of transfers
  const [transferHistory, setTransferHistory] = useState<RouteHistory[]>([
    { id: 'RH-1', routeId: 'R-1', shopId: 'S-2', previousRouteId: 'R-2', newRouteId: 'R-1', transferredBy: 'Muddasir Farid (MG-0001)', timestamp: '2026-06-28 14:15:22' },
    { id: 'RH-2', routeId: 'R-2', shopId: 'S-4', previousRouteId: 'R-3', newRouteId: 'R-2', transferredBy: 'Muddasir Farid (MG-0001)', timestamp: '2026-06-29 10:45:10' }
  ]);

  // Create Route Action
  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoute.name.trim()) return;

    const nextId = `R-${routes.length + 1}`;
    const item: Route = {
      id: nextId,
      name: newRoute.name,
      area: newRoute.area,
      beatPlan: newRoute.beatPlan,
      assignedEmployeeId: newRoute.assignedEmployeeId
    };

    setRoutes(prev => [...prev, item]);
    logAudit(`Created new route compliance beat: ${newRoute.name} (${nextId})`, 'Route Compliance');
    setNewRoute({ name: '', area: '', beatPlan: 'Mon / Wed / Fri', assignedEmployeeId: '' });
    setShowAddRoute(false);
  };

  // Perform Single Route Transfer
  const handleSingleTransfer = () => {
    if (!selectedShopId || !targetRouteId) {
      alert("Please select both a shop and a destination target route.");
      return;
    }

    const shop = shops.find(s => s.id === selectedShopId);
    if (!shop) return;

    const previousRouteId = shop.routeId;
    if (previousRouteId === targetRouteId) {
      alert("Shop is already assigned to this target route!");
      return;
    }

    // Update shops route in state
    setShops(prev => prev.map(s => s.id === selectedShopId ? { ...s, routeId: targetRouteId } : s));

    // Append to compliance history
    const logItem: RouteHistory = {
      id: `RH-${Date.now()}`,
      routeId: targetRouteId,
      shopId: selectedShopId,
      previousRouteId,
      newRouteId: targetRouteId,
      transferredBy: 'Muddasir Farid (MG-0001)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setTransferHistory(prev => [logItem, ...prev]);
    logAudit(`Transferred shop "${shop.shopName}" from route ${previousRouteId} to ${targetRouteId}`, 'Route Compliance');
    alert(`Successfully transferred "${shop.shopName}" to destination route.`);
    setSelectedShopId('');
  };

  // Perform Bulk Route Transfer
  const handleBulkTransfer = () => {
    if (!sourceRouteId || !targetRouteId) {
      alert("Please select both a source route and a target destination route.");
      return;
    }

    if (sourceRouteId === targetRouteId) {
      alert("Source and target routes cannot be identical!");
      return;
    }

    const shopsToTransfer = shops.filter(s => s.routeId === sourceRouteId && s.status === 'Approved');
    if (shopsToTransfer.length === 0) {
      alert("No active shops found inside the source route to transfer.");
      return;
    }

    // Update all shops matching source to target route
    setShops(prev => prev.map(s => s.routeId === sourceRouteId ? { ...s, routeId: targetRouteId } : s));

    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLogs: RouteHistory[] = shopsToTransfer.map((s, idx) => ({
      id: `RH-BULK-${Date.now()}-${idx}`,
      routeId: targetRouteId,
      shopId: s.id,
      previousRouteId: sourceRouteId,
      newRouteId: targetRouteId,
      transferredBy: 'Muddasir Farid (MG-0001)',
      timestamp: timestampStr
    }));

    setTransferHistory(prev => [...newLogs, ...prev]);
    logAudit(`Bulk route compliance transfer: Migrated ${shopsToTransfer.length} shops from route ${sourceRouteId} to ${targetRouteId}`, 'Route Compliance');
    alert(`Bulk migration complete. ${shopsToTransfer.length} shops transferred from ${sourceRouteId} to ${targetRouteId}.`);
    setSourceRouteId('');
  };

  return (
    <div className="space-y-6" id="route-management">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Route Creator & List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Map className="h-5 w-5 text-indigo-600" />
                  Route &amp; Beat Compliance Planner
                </h3>
                <p className="text-xs text-slate-500">
                  Configure logistics sectors, set beat schedule intervals, and assign field operators.
                </p>
              </div>
              <button 
                onClick={() => setShowAddRoute(!showAddRoute)}
                className="bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Define Beat
              </button>
            </div>

            {showAddRoute && (
              <form onSubmit={handleAddRoute} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Route Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Route-D (West Area)"
                      value={newRoute.name}
                      onChange={e => setNewRoute(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Target Sector Area *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Westridge Sector III"
                      value={newRoute.area}
                      onChange={e => setNewRoute(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Beat Frequency schedule</label>
                    <select 
                      value={newRoute.beatPlan}
                      onChange={e => setNewRoute(prev => ({ ...prev, beatPlan: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      <option value="Mon / Wed / Fri">Monday / Wednesday / Friday</option>
                      <option value="Tue / Thu / Sat">Tuesday / Thursday / Saturday</option>
                      <option value="Daily Compliance">Daily Compliance (All days)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Assigned Field Operator</label>
                    <select 
                      value={newRoute.assignedEmployeeId}
                      onChange={e => setNewRoute(prev => ({ ...prev, assignedEmployeeId: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      <option value="">Unassigned Pool</option>
                      {users.filter(u => u.role === 'Order Booker' || u.role === 'Supervisor' || u.role === 'Supply Man').map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddRoute(false)}
                    className="bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-indigo-600 text-white text-[11px] font-bold px-4 py-1.5 rounded"
                  >
                    Save Beat Route
                  </button>
                </div>
              </form>
            )}

            {/* Routes List grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="routes-list-planner">
              {routes.map(r => {
                const routeShops = shops.filter(s => s.routeId === r.id && s.status === 'Approved');
                const operator = users.find(u => u.id === r.assignedEmployeeId);

                return (
                  <div key={r.id} className="border border-slate-100 bg-slate-50/40 p-5 rounded-2xl hover:border-indigo-100 hover:bg-white transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                          {r.id}
                        </span>
                        <h4 className="font-bold text-slate-800 mt-2 text-sm">{r.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{r.area}</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                        {routeShops.length} Retailers
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Beat Schedule</span>
                        <span className="font-semibold text-slate-800">{r.beatPlan}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Field Runner</span>
                        <span className="font-semibold text-slate-800">{operator ? operator.name : 'Unassigned Pool'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Route Transfers Control Desk */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <Activity className="h-5 w-5 text-rose-500" />
              Route Transfer Desk
            </h4>
            
            {/* Toggle mode: single vs bulk */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button 
                onClick={() => setTransferMode('single')}
                className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                  transferMode === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Single Shop
              </button>
              <button 
                onClick={() => setTransferMode('bulk')}
                className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                  transferMode === 'bulk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Bulk Transfer
              </button>
            </div>

            {transferMode === 'single' ? (
              <div className="space-y-3 text-xs">
                {/* Single Shop selection */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Select Retailer Shop</label>
                  <select 
                    value={selectedShopId}
                    onChange={e => setSelectedShopId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  >
                    <option value="">Select Retailer Shop...</option>
                    {shops.filter(s => s.status === 'Approved').map(s => (
                      <option key={s.id} value={s.id}>
                        {s.shopName} (Current Route: {routes.find(r => r.id === s.routeId)?.name || s.routeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target route selection */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Destination Target Route</label>
                  <select 
                    value={targetRouteId}
                    onChange={e => setTargetRouteId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  >
                    <option value="">Choose Target Beat Route...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} - {r.beatPlan}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleSingleTransfer}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  Confirm Transfer <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Source Route */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Source Beat Route</label>
                  <select 
                    value={sourceRouteId}
                    onChange={e => setSourceRouteId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  >
                    <option value="">Choose Source Route...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({shops.filter(s => s.routeId === r.id && s.status === 'Approved').length} Shops)</option>
                    ))}
                  </select>
                </div>

                {/* Target Route */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Destination Beat Route</label>
                  <select 
                    value={targetRouteId}
                    onChange={e => setTargetRouteId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-medium"
                  >
                    <option value="">Choose Destination Route...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({shops.filter(s => s.routeId === r.id && s.status === 'Approved').length} Shops)</option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-lg text-[10px] flex items-start gap-1">
                  <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>
                    Warning: Bulk transfer moves all approved retail outlets from the source beat to the target. This will update their SFA schedules immediately on their mobile devices.
                  </span>
                </div>

                <button 
                  onClick={handleBulkTransfer}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  Confirm Bulk Migration <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer History compliance audit log */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-indigo-600" />
          Beat Transfer Compliance Ledger
        </h4>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs border-collapse" id="route-history-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-[10px] uppercase">
                <th className="p-3">Reference ID</th>
                <th className="p-3">Transferred Outlet</th>
                <th className="p-3">Previous Beat Sector</th>
                <th className="p-3">New Route Beat Sector</th>
                <th className="p-3">Authorized By</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transferHistory.map(hist => {
                const shopName = shops.find(s => s.id === hist.shopId)?.shopName || hist.shopId;
                const prevRoute = routes.find(r => r.id === hist.previousRouteId)?.name || hist.previousRouteId;
                const nextRoute = routes.find(r => r.id === hist.newRouteId)?.name || hist.newRouteId;

                return (
                  <tr key={hist.id} className="hover:bg-slate-50/40">
                    <td className="p-3 font-mono font-bold text-slate-400">{hist.id}</td>
                    <td className="p-3 font-bold text-slate-900">{shopName}</td>
                    <td className="p-3 text-rose-600">{prevRoute}</td>
                    <td className="p-3 text-emerald-600">{nextRoute}</td>
                    <td className="p-3 text-slate-600">{hist.transferredBy}</td>
                    <td className="p-3 text-right font-mono text-slate-400">{hist.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
