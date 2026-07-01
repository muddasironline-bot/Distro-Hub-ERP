import React from 'react';
import { 
  Building, 
  Users, 
  Key, 
  Store, 
  ShoppingCart, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  MapPin, 
  UserX 
} from 'lucide-react';
import { Company, User, License, Shop, Order } from '../types';

interface DashboardProps {
  companies: Company[];
  users: User[];
  licenses: License[];
  shops: Shop[];
  orders: Order[];
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({ 
  companies, 
  users, 
  licenses, 
  shops, 
  orders, 
  onNavigate 
}: DashboardProps) {
  
  // Calculations
  const activeCompanies = companies.filter(c => c.status === 'Active').length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status !== 'Active').length;
  const activeLicenses = licenses.filter(l => l.status === 'Active').length;
  const pendingShops = shops.filter(s => s.status === 'Pending').length;
  const approvedShops = shops.filter(s => s.status === 'Approved').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  const totalSalesApproved = orders
    .filter(o => o.status === 'Approved')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // License warnings
  const trialLicenses = licenses.filter(l => l.type === 'Trial' && l.status === 'Active');
  
  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Upper Status Banner */}
      <div className="bg-slate-900 border-l-4 border-teal-500 text-white p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm" id="erp-status-banner">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Central ERP Operations Server is Live</h3>
            <p className="text-xs text-slate-400">Connected to SFA Mobile App Client &amp; Operations Desktop. Synchronized globally.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1">
            ● JWT Security Active
          </span>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-medium border border-blue-500/30 flex items-center gap-1">
            ● Device Binding Enforced
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-grid">
        {/* Card 1 */}
        <div 
          onClick={() => onNavigate('companies')}
          className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md relative overflow-hidden group"
          id="stat-card-distributions"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50/40 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Distributions Active</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{activeCompanies}</span>
            <span className="text-xs text-slate-400 font-medium">of {companies.length} Registered</span>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-bold hover:underline">Manage Distribution Houses &rarr;</div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onNavigate('users')}
          className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md relative overflow-hidden group"
          id="stat-card-users"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50/40 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Central Active Users</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{activeUsers}</span>
            <span className="text-xs text-emerald-600 font-bold">{inactiveUsers} Deactivated</span>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-bold hover:underline">Verify login statuses &rarr;</div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onNavigate('licenses')}
          className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md relative overflow-hidden group"
          id="stat-card-licenses"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50/40 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Licenses</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Key className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{activeLicenses}</span>
            <span className="text-xs text-slate-400 font-medium">Cryptographically Signed</span>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-bold hover:underline">Check expiry or renew &rarr;</div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md relative overflow-hidden group"
          id="stat-card-revenue"
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50/40 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved Order Value</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">PKR {totalSalesApproved.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">Approved Sales</span>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-bold hover:underline">Review pending orders &rarr;</div>
        </div>
      </div>

      {/* Double Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Action Centers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Critical Operational Center Alerts */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Immediate Action Alerts</h4>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-bold">
                Live Monitors
              </span>
            </div>

            <div className="space-y-4">
              {/* Deactivation Compliance Information Alert */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-3">
                <div className="p-2 bg-slate-200 text-slate-700 rounded-lg shrink-0">
                  <UserX className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-900">Server User Kill-Switch Verification</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Deactivating any user in the **Central User Management** tab immediately blocks authorization tokens (JWT). Access to operations desktops, mobile SFA applets, and route order booking terminates under 1 second.
                  </p>
                </div>
              </div>

              {/* Pending Shop Inductions Alert */}
              {pendingShops > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-250 flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-amber-900">New Shop Inductions Pending Approval</h5>
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                        {pendingShops} Action Required
                      </span>
                    </div>
                    <p className="text-xs text-amber-700">
                      Order Bookers have requested inductions for new shops. Review locations, owner details, and verify credit limits. Once approved, they populate the next route beat plan automatically.
                    </p>
                    <button 
                      onClick={() => onNavigate('shops')}
                      className="mt-2 text-xs font-semibold text-amber-900 hover:underline flex items-center gap-1"
                    >
                      Open Inductions Approval Desk &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Pending Orders Queue */}
              {pendingOrders > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-blue-900">Incoming Orders Review Desk</h5>
                      <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                        {pendingOrders} Incoming
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Field SFA order bookings are waiting in the queue. Inspect inventory allocations, verify geo-radius compliance flags, and dispatch invoice generation.
                    </p>
                    <button 
                      onClick={() => onNavigate('orders')}
                      className="mt-2 text-xs font-semibold text-blue-900 hover:underline"
                    >
                      Open Order Control Center &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Trial Expiry Warning */}
              {trialLicenses.length > 0 && (
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 flex items-start gap-3">
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0">
                    <Key className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-sm font-semibold text-rose-900">Active Trial Distribution Licenses Warning</h5>
                    <p className="text-xs text-rose-700">
                      We have active short-duration distribution licenses online. Ensure payment recoveries or assign a Monthly/Yearly certificate before lockouts occur.
                    </p>
                    <button 
                      onClick={() => onNavigate('licenses')}
                      className="mt-2 text-xs font-semibold text-rose-950 hover:underline"
                    >
                      Inspect License Terms &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SFA Compliance Overview */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              SFA Geofencing &amp; Route Compliance Stats
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Geofence Compliance</span>
                <span className="text-2xl font-bold text-emerald-600 block mt-1">98.4%</span>
                <span className="text-[10px] text-slate-400">Within 50m Shop Limit</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Route Compliance Ratio</span>
                <span className="text-2xl font-bold text-blue-600 block mt-1">92.1%</span>
                <span className="text-[10px] text-slate-400">Beat schedule sequence matched</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Active Route Transfers</span>
                <span className="text-2xl font-bold text-slate-700 block mt-1">14 Today</span>
                <span className="text-[10px] text-slate-400">Distributions optimized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Server Parameters */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider text-slate-400">System Information</h4>
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs text-slate-400 block font-medium">Laravel JWT Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-700">Enabled (HMAC-SHA256)</span>
                </div>
              </div>
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs text-slate-400 block font-medium">Central MySQL Server</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">Connected &amp; Scalable</span>
                </div>
              </div>
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs text-slate-400 block font-medium">Assigned Hardware Lock</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">IMEI Binding Active</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Digital Signature Method</span>
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded mt-1.5 inline-block">
                  RSA-2048 Cryptography
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
            <h4 className="font-bold text-base mb-2">Laravel/MySQL &amp; Flutter Integration Hub</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Need to deploy this exact system onto your AWS EC2 or DigitalOcean droplet? The Integration Hub contains all database migrations, JWT middlewares, device trackers, and configurations.
            </p>
            <button 
              onClick={() => onNavigate('code')}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded hover:bg-blue-700 transition-colors shadow-md w-full"
            >
              Export Source Code &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
