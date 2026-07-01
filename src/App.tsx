import React, { useState } from 'react';
import { 
  BarChart2, 
  Key, 
  Users, 
  Store, 
  Navigation, 
  Compass, 
  ShoppingCart, 
  Printer, 
  Database, 
  FileText, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  FileCode, 
  Menu, 
  X, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

// Import Mock Data
import { 
  initialCompanies, 
  initialUsers, 
  initialLicenses, 
  initialShops, 
  initialRoutes, 
  initialOrders, 
  initialInventory, 
  initialAccounts, 
  initialPayroll, 
  initialGpsLogs, 
  initialAuditLogs 
} from './data/mockData';

// Import Types
import { 
  Company, 
  User, 
  License, 
  Shop, 
  Route, 
  Order, 
  InventoryItem, 
  AccountVoucher, 
  PayrollRecord, 
  GpsLog, 
  AuditLog 
} from './types';

// Import Components
import DashboardOverview from './components/DashboardOverview';
import LicenseManagement from './components/LicenseManagement';
import UserManagement from './components/UserManagement';
import CustomerManagement from './components/CustomerManagement';
import RouteManagement from './components/RouteManagement';
import GpsMonitoring from './components/GpsMonitoring';
import OrderControl from './components/OrderControl';
import InvoiceControl from './components/InvoiceControl';
import InventoryManagement from './components/InventoryManagement';
import AccountsModule from './components/AccountsModule';
import PayrollModule from './components/PayrollModule';
import ReportsCenter from './components/ReportsCenter';
import SecurityAudits from './components/SecurityAudits';
import CodeExporter from './components/CodeExporter';

export default function App() {
  
  // Sidebar State & Active Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Core Global States
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [accounts, setAccounts] = useState<AccountVoucher[]>(initialAccounts);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(initialPayroll);
  const [gpsLogs, setGpsLogs] = useState<GpsLog[]>(initialGpsLogs);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Session user context (Simulating Super Admin Muddasir Farid)
  const currentSessionUser = "Muddasir Farid (MG-0001)";

  // Global log generator helper for audit logs
  const logAudit = (action: string, module: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentSessionUser,
      action,
      module,
      ipAddress: '192.168.1.100'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" id="erp-root">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside 
        className={`bg-slate-900 text-slate-400 shrink-0 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-40 fixed lg:relative h-screen ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Sidebar Logo Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm">
                DH
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-sm leading-tight">DistroHub</h1>
                  <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Enterprise ERP</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1" id="sidebar-nav">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2, category: 'Central Control' },
              { id: 'licensing', label: 'Cryptographic Licensing', icon: Key, category: 'Assets & Access' },
              { id: 'users', label: 'User & Companies', icon: Users, category: 'Central Control' },
              { id: 'customers', label: 'Customer Shops', icon: Store, category: 'Assets & Access' },
              { id: 'routes', label: 'Route Beats Scheduler', icon: Navigation, category: 'Assets & Access' },
              { id: 'gps', label: 'Live GPS Satellite Map', icon: Compass, category: 'Assets & Access' },
              { id: 'orders', label: 'SFA Order Control', icon: ShoppingCart, category: 'Central Control' },
              { id: 'invoices', label: 'Invoices & Thermal Slips', icon: Printer, category: 'Central Control' },
              { id: 'inventory', label: 'Warehouse Stock', icon: Database, category: 'Assets & Access' },
              { id: 'accounts', label: 'General Ledgers', icon: FileText, category: 'Assets & Access' },
              { id: 'payroll', label: 'Salaries & Fuel', icon: DollarSign, category: 'Assets & Access' },
              { id: 'reports', label: 'Reports Center', icon: Activity, category: 'Central Control' },
              { id: 'security', label: 'Security & Privileges', icon: ShieldCheck, category: 'Central Control' },
              { id: 'code', label: 'API Code Exporter', icon: FileCode, category: 'Central Control' },
            ].map((item, index, arr) => {
              const Icon = typeof item.icon === 'function' ? item.icon : item.icon;
              const isActive = activeTab === item.id;
              
              // Helper to define category labels matching Design HTML
              const categoryLabel = item.category || (['licensing', 'customers', 'routes', 'gps', 'inventory', 'accounts', 'payroll'].includes(item.id) ? 'Assets & Access' : 'Central Control');
              
              const prevItem = index > 0 ? arr[index - 1] : null;
              const prevCategory = prevItem ? (prevItem.category || (['licensing', 'customers', 'routes', 'gps', 'inventory', 'accounts', 'payroll'].includes(prevItem.id) ? 'Assets & Access' : 'Central Control')) : null;
              const showCategoryHeader = sidebarOpen && (index === 0 || prevCategory !== categoryLabel);

              return (
                <React.Fragment key={item.id}>
                  {showCategoryHeader && (
                    <p className="px-2 text-[10px] uppercase font-semibold text-slate-500 mt-4 mb-2 tracking-wider">
                      {categoryLabel}
                    </p>
                  )}
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors text-left text-xs font-semibold ${
                      isActive 
                        ? 'bg-slate-800 text-white font-bold' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                MF
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Muddasir Farid</p>
                <p className="text-[10px] text-slate-500 truncate">Server Node #01</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:pl-0' : 'lg:pl-0'}`} style={{ marginLeft: !sidebarOpen ? '0' : '' }}>
        
        {/* UPPER CORPORATE HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 shrink-0 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400">DISTRIBUTION:</span>
              <select className="bg-slate-100 border-none rounded text-xs font-semibold px-3 py-1.5 text-slate-600 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500">
                <option>Farid Cosmetics Distribution</option>
                <option>Farid Snacks Distribution</option>
                <option>Farid Beverages Distribution</option>
              </select>
            </div>
          </div>

          {/* Vitals & Switches */}
          <div className="flex items-center gap-4 md:gap-6 text-xs font-bold text-slate-600">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded text-[10px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 uppercase font-bold">SFA Sync: Live</span>
            </div>
            
            <div className="relative cursor-pointer hover:opacity-80">
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <span className="text-slate-900 font-bold text-xs block">{currentSessionUser.split(' ')[0]}</span>
                <span className="text-[9px] text-slate-400 block uppercase font-semibold tracking-wider">Super Admin</span>
              </div>
              <div className="h-8 w-8 bg-blue-600 text-white font-bold rounded flex items-center justify-center text-xs uppercase shadow-sm">
                MF
              </div>
            </div>
          </div>
        </header>

        {/* CENTRAL VIEW AREA */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              companies={companies}
              users={users}
              licenses={licenses}
              shops={shops}
              orders={orders}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'licensing' && (
            <LicenseManagement 
              licenses={licenses}
              companies={companies}
              setLicenses={setLicenses}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement 
              users={users}
              companies={companies}
              routes={routes}
              setUsers={setUsers}
              setCompanies={setCompanies}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerManagement 
              shops={shops}
              routes={routes}
              setShops={setShops}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'routes' && (
            <RouteManagement 
              routes={routes}
              shops={shops}
              users={users}
              setRoutes={setRoutes}
              setShops={setShops}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'gps' && (
            <GpsMonitoring 
              gpsLogs={gpsLogs}
            />
          )}

          {activeTab === 'orders' && (
            <OrderControl 
              orders={orders}
              shops={shops}
              users={users}
              setOrders={setOrders}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceControl 
              orders={orders}
              shops={shops}
              users={users}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManagement 
              inventory={inventory}
              companies={companies}
              setInventory={setInventory}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsModule 
              accounts={accounts}
              setAccounts={setAccounts}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollModule 
              payroll={payroll}
              users={users}
              setPayroll={setPayroll}
              logAudit={logAudit}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsCenter 
              orders={orders}
              shops={shops}
              accounts={accounts}
            />
          )}

          {activeTab === 'security' && (
            <SecurityAudits 
              auditLogs={auditLogs}
              users={users}
              setUsers={setUsers}
            />
          )}

          {activeTab === 'code' && (
            <CodeExporter />
          )}
        </main>
      </div>
    </div>
  );
}
