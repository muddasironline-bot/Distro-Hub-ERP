import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Activity, 
  KeyRound, 
  Check, 
  X, 
  Eye, 
  Fingerprint, 
  AlertTriangle 
} from 'lucide-react';
import { AuditLog, User as CentralUser } from '../types';

interface SecurityProps {
  auditLogs: AuditLog[];
  users: CentralUser[];
  setUsers: React.Dispatch<React.SetStateAction<CentralUser[]>>;
}

export default function SecurityAudits({ auditLogs, users, setUsers }: SecurityProps) {
  
  // Interactive Role Permission checklist state representation
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    'Super Admin': ['all', 'licenses_write', 'users_write', 'orders_approve', 'accounts_post', 'payroll_write'],
    'Company Admin': ['licenses_write', 'users_write', 'orders_approve', 'accounts_post', 'payroll_write'],
    'Manager': ['users_write', 'orders_approve', 'accounts_post'],
    'Supervisor': ['orders_approve'],
    'Accountant': ['accounts_post', 'payroll_write'],
    'Warehouse Manager': ['stock_write'],
    'Order Booker': ['orders_book'],
    'Supply Man': ['deliver_challan']
  });

  // Action to release device binding (important feature!)
  const releaseDeviceLock = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, deviceId: '' } : u));
    alert(`Device binding released for user ID: ${id}. Booker can now bind to a new SFA phone on their next login.`);
  };

  // Toggle permission checklist representation helper
  const togglePermission = (role: string, perm: string) => {
    setRolePermissions(prev => {
      const current = prev[role] || [];
      const updated = current.includes(perm) 
        ? current.filter(p => p !== perm) 
        : [...current, perm];
      return { ...prev, [role]: updated };
    });
  };

  return (
    <div className="space-y-6" id="security-hub">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          Central Security &amp; Access Compliance Engine
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Configure security protocols: Manage JWT parameters, release physical hardware UUID locks, and customize role-based ACL permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Role Matrix and Device lock release */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Role Permission Matrix Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <KeyRound className="h-4.5 w-4.5 text-blue-600" />
              Role-Based ACL Permissions Control Matrix
            </h4>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                    <th className="p-3">User Role Class</th>
                    <th className="p-3 text-center">Manage Licenses</th>
                    <th className="p-3 text-center">Manage Users</th>
                    <th className="p-3 text-center">Approve Orders</th>
                    <th className="p-3 text-center">Write Ledger</th>
                    <th className="p-3 text-center">Book Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {Object.keys(rolePermissions).map(role => (
                    <tr key={role} className="hover:bg-slate-50/40">
                      <td className="p-3 font-bold text-slate-900">{role}</td>
                      <td className="p-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={rolePermissions[role].includes('licenses_write') || rolePermissions[role].includes('all')}
                          onChange={() => togglePermission(role, 'licenses_write')}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={rolePermissions[role].includes('users_write') || rolePermissions[role].includes('all')}
                          onChange={() => togglePermission(role, 'users_write')}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={rolePermissions[role].includes('orders_approve') || rolePermissions[role].includes('all')}
                          onChange={() => togglePermission(role, 'orders_approve')}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={rolePermissions[role].includes('accounts_post') || rolePermissions[role].includes('all')}
                          onChange={() => togglePermission(role, 'accounts_post')}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={rolePermissions[role].includes('orders_book') || rolePermissions[role].includes('all')}
                          onChange={() => togglePermission(role, 'orders_book')}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Bind locks release console */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Smartphone className="h-4.5 w-4.5 text-rose-500" />
              Active Hardware UUID Binding locks
            </h4>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                    <th className="p-3">Generated User ID</th>
                    <th className="p-3">Operator Name</th>
                    <th className="p-3 font-mono">Hardware UUID / IMEI Signature</th>
                    <th className="p-3">Binding Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {users.filter(u => u.deviceId).map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/40">
                      <td className="p-3 font-mono font-bold text-blue-700">{u.id}</td>
                      <td className="p-3 font-bold text-slate-900">{u.name}</td>
                      <td className="p-3 font-mono text-slate-400">{u.deviceId}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          ● BOUND &amp; SECURED
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => releaseDeviceLock(u.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded transition-all"
                        >
                          Release Lock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: JWT Parameter info and Live audit trails */}
        <div className="space-y-6">
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="h-4.5 w-4.5" /> Security Parameters
            </h4>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="border-b border-slate-800 pb-2.5">
                <span className="text-[10px] text-slate-500 font-bold block">JWT AUTHENTICATION TYPE</span>
                <span className="font-mono text-white font-semibold block mt-0.5">HS-256 (Tymon Auth Config)</span>
              </div>
              <div className="border-b border-slate-800 pb-2.5">
                <span className="text-[10px] text-slate-500 font-bold block">TOKEN SESSION EXPIRATION</span>
                <span className="font-mono text-white font-semibold block mt-0.5">1440 Minutes (24 Hours)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">2FA PROTOCOL STATUS</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> Ready for OTP SMS Module
                </span>
              </div>
            </div>
          </div>

          {/* Audit trails */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-blue-600" />
              Central Security Audit Logs
            </h4>

            <div className="space-y-3 max-h-96 overflow-y-auto" id="security-audit-logs">
              {auditLogs.map(log => (
                <div key={log.id} className="text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
                    <span>{log.id} | {log.module}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="font-bold text-slate-800">{log.action}</p>
                  <div className="text-[10px] text-slate-500">IP address logged: {log.ipAddress} | User: {log.user}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
