import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Plus, 
  Edit, 
  KeyRound, 
  UserCheck, 
  UserMinus, 
  Smartphone, 
  Search, 
  Check, 
  X, 
  ShieldAlert, 
  Info 
} from 'lucide-react';
import { Company, User, UserRole, UserStatus, Route } from '../types';

interface UserManagementProps {
  companies: Company[];
  users: User[];
  routes: Route[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function UserManagement({ 
  companies, 
  users, 
  routes, 
  setCompanies, 
  setUsers,
  logAudit 
}: UserManagementProps) {
  
  // State for Distributions
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [companyEditName, setCompanyEditName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);

  // State for User Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // State for User Form Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [formUser, setFormUser] = useState({
    id: '',
    name: '',
    role: 'Order Booker' as UserRole,
    status: 'Active' as UserStatus,
    distributionId: 'COM-1',
    routeId: '',
    deviceId: ''
  });

  // Edit Company functions
  const startEditCompany = (co: Company) => {
    setEditingCompanyId(co.id);
    setCompanyEditName(co.name);
  };

  const saveCompanyEdit = (id: string) => {
    if (!companyEditName.trim()) return;
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, name: companyEditName } : c));
    logAudit(`Renamed Distribution/Company to: "${companyEditName}"`, 'Multi Company');
    setEditingCompanyId(null);
  };

  const addCompany = () => {
    if (!newCompanyName.trim()) return;
    const newId = `COM-${companies.length + 1}`;
    setCompanies(prev => [...prev, { id: newId, name: newCompanyName, status: 'Active' }]);
    logAudit(`Added new Distribution: "${newCompanyName}"`, 'Multi Company');
    setNewCompanyName('');
    setShowAddCompany(false);
  };

  // Helper to generate IDs based on role
  const generateLoginId = (role: UserRole): string => {
    let prefix = 'OB'; // Order Booker
    if (role === 'Supply Man') prefix = 'SM';
    else if (role === 'Operations User') prefix = 'OP';
    else if (role === 'Super Admin' || role === 'Company Admin' || role === 'Manager') prefix = 'MG';
    else if (role === 'Supervisor') prefix = 'SP';
    else if (role === 'Accountant') prefix = 'AC';
    else if (role === 'Warehouse Manager') prefix = 'WH';

    // Count existing users with this prefix
    const existingCount = users.filter(u => u.id.startsWith(prefix)).length;
    const nextNum = String(existingCount + 1).padStart(4, '0');
    return `${prefix}-${nextNum}`;
  };

  // Open Add User Form
  const openAddUser = () => {
    setIsEditingUser(false);
    setFormUser({
      id: generateLoginId('Order Booker'), // Initial standard default
      name: '',
      role: 'Order Booker',
      status: 'Active',
      distributionId: companies[0]?.id || 'COM-1',
      routeId: routes[0]?.id || '',
      deviceId: `DEV-UUID-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setShowUserModal(true);
  };

  // Open Edit User Form
  const openEditUser = (user: User) => {
    setIsEditingUser(true);
    setFormUser({ ...user });
    setShowUserModal(true);
  };

  // Handle Form Role change to auto-update generated Login ID if creating
  const handleRoleChangeInForm = (role: UserRole) => {
    if (!isEditingUser) {
      setFormUser(prev => ({
        ...prev,
        role,
        id: generateLoginId(role)
      }));
    } else {
      setFormUser(prev => ({ ...prev, role }));
    }
  };

  // Save/Update User
  const saveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUser.name.trim()) return;

    if (isEditingUser) {
      // Edit mode
      setUsers(prev => prev.map(u => u.id === formUser.id ? { ...formUser } : u));
      logAudit(`Modified Central User profile: ${formUser.name} (${formUser.id})`, 'Central Users');
    } else {
      // Create mode
      setUsers(prev => [...prev, { ...formUser }]);
      logAudit(`Created Central User login: ${formUser.name} with Generated ID: ${formUser.id}`, 'Central Users');
    }

    setShowUserModal(false);
  };

  // Quick Action: Toggle User Status
  const toggleUserStatus = (id: string, newStatus: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    const uName = users.find(u => u.id === id)?.name || id;
    logAudit(`Administrative action: Changed status of ${uName} (${id}) to: "${newStatus}"`, 'Central Users');
  };

  // Quick Action: Reset Password simulator
  const resetUserPassword = (id: string) => {
    const uName = users.find(u => u.id === id)?.name || id;
    alert(`Password reset link generated for ${uName} (${id}). Simulated SMS/Email dispatched: "DefaultPass123"`);
    logAudit(`Requested Password Reset for Central User: ${uName} (${id})`, 'Central Users');
  };

  // Filters logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.deviceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8" id="user-management-module">
      {/* SECTION 1: Multi-Company & Distribution Administration */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-600" />
              Multi-Company &amp; Distributions Manager
            </h3>
            <p className="text-xs text-slate-500">
              One central company can control multiple custom distribution houses. Edit names instantly below.
            </p>
          </div>
          <button 
            onClick={() => setShowAddCompany(!showAddCompany)}
            className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Add Distribution
          </button>
        </div>

        {/* Add Company Field */}
        {showAddCompany && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row items-end gap-3 max-w-2xl">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-slate-600 block mb-1">New Distribution Name</label>
              <input 
                type="text" 
                placeholder="e.g. Farid Foods Distribution"
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={addCompany}
                className="flex-1 md:flex-none bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-all"
              >
                Save
              </button>
              <button 
                onClick={() => setShowAddCompany(false)}
                className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-lg hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Distributions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="distributions-grid">
          {companies.map(co => (
            <div 
              key={co.id} 
              className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-200 hover:bg-white transition-all shadow-sm"
            >
              <div>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                  {co.id}
                </span>
                
                {editingCompanyId === co.id ? (
                  <div className="mt-3 flex gap-1">
                    <input 
                      type="text" 
                      value={companyEditName}
                      onChange={e => setCompanyEditName(e.target.value)}
                      className="bg-white border border-slate-300 text-xs p-1.5 rounded w-full focus:outline-none"
                    />
                    <button 
                      onClick={() => saveCompanyEdit(co.id)}
                      className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                      <Check className="h-4.5 w-4.5" />
                    </button>
                    <button 
                      onClick={() => setEditingCompanyId(null)}
                      className="p-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ) : (
                  <h4 className="font-bold text-slate-800 mt-2.5 text-sm">{co.name}</h4>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {users.filter(u => u.distributionId === co.id).length} Users Bound
                </span>
                {editingCompanyId !== co.id && (
                  <button 
                    onClick={() => startEditCompany(co)}
                    className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                    title="Rename Distribution"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Central User Management */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Central User ID Register &amp; Device Binder
            </h3>
            <p className="text-xs text-slate-500">
              Generate standardized login IDs, bind roles to routes, and restrict app usage to specified hardware devices.
            </p>
          </div>
          <button 
            onClick={openAddUser}
            className="bg-teal-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-all flex items-center gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Create ERP / SFA User
          </button>
        </div>

        {/* Kill Switch Security Alert */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-6 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Real-time Deactivation Active:</span> Deactivating or suspending a user here immediately revokes the JWT keys from our central auth server. The mobile SFA or operations applet will forcefully logout within 1 heartbeat cycle.
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Login ID, Name or Device UUID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 w-full text-sm focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Company Admin">Company Admin</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Accountant">Accountant</option>
              <option value="Warehouse Manager">Warehouse Manager</option>
              <option value="Operations User">Operations User</option>
              <option value="Order Booker">Order Booker</option>
              <option value="Supply Man">Supply Man</option>
            </select>
          </div>
          <div>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 w-full text-sm focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Deactivated">Deactivated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm border-collapse" id="users-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <th className="p-4 text-xs font-bold uppercase">Generated Login ID</th>
                <th className="p-4 text-xs font-bold uppercase">Employee / Operator Name</th>
                <th className="p-4 text-xs font-bold uppercase">Role</th>
                <th className="p-4 text-xs font-bold uppercase">Bound Distribution</th>
                <th className="p-4 text-xs font-bold uppercase">Bound Route</th>
                <th className="p-4 text-xs font-bold uppercase">Hardware Token (UUID)</th>
                <th className="p-4 text-xs font-bold uppercase text-center">Security Status</th>
                <th className="p-4 text-xs font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                        {u.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'Super Admin' || u.role === 'Company Admin' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                          : u.role === 'Order Booker' || u.role === 'Supply Man' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs">
                      {companies.find(c => c.id === u.distributionId)?.name || 'Central Pool'}
                    </td>
                    <td className="p-4 text-slate-600 text-xs font-semibold">
                      {routes.find(r => r.id === u.routeId)?.name || 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                        <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                        {u.deviceId || 'Unbound'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        u.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : u.status === 'Suspended' 
                          ? 'bg-amber-50 text-amber-700 border-amber-100' 
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openEditUser(u)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-all"
                          title="Edit Profile"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => resetUserPassword(u.id)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-all"
                          title="Reset Password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        {u.status === 'Active' ? (
                          <button 
                            onClick={() => toggleUserStatus(u.id, 'Deactivated')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-all"
                            title="Kill Token: Deactivate"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleUserStatus(u.id, 'Active')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                            title="Restore Token: Activate"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No matching central users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER FORM MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">
                {isEditingUser ? 'Edit User Profile' : 'Register Central User ID'}
              </h4>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveUser} className="p-6 space-y-4">
              {/* Login ID Visual Indicator */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">AUTO-GENERATED ID</span>
                  <span className="text-lg font-mono font-bold text-indigo-700">{formUser.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block">TYPE</span>
                  <span className="text-xs bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full font-bold text-indigo-800">
                    Central Secure
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Full Employee Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Zia-ur-Rehman"
                  value={formUser.name}
                  onChange={e => setFormUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Grid 1: Role & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Employee Role</label>
                  <select 
                    value={formUser.role}
                    disabled={isEditingUser} // Disable changing role for existing login IDs to maintain sequence
                    onChange={e => handleRoleChangeInForm(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Company Admin">Company Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Warehouse Manager">Warehouse Manager</option>
                    <option value="Operations User">Operations User</option>
                    <option value="Order Booker">Order Booker</option>
                    <option value="Supply Man">Supply Man</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Security Status</label>
                  <select 
                    value={formUser.status}
                    onChange={e => setFormUser(prev => ({ ...prev, status: e.target.value as UserStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivated">Deactivated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Company Distribution and Route */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Assigned Distribution</label>
                  <select 
                    value={formUser.distributionId}
                    onChange={e => setFormUser(prev => ({ ...prev, distributionId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Assigned Compliance Route</label>
                  <select 
                    value={formUser.routeId}
                    onChange={e => setFormUser(prev => ({ ...prev, routeId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    <option value="">Unassigned Pool</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hardware Lock Binding UUID */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
                  Hardware Device UUID Binding Lock
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. DEV-UUID-1001"
                  value={formUser.deviceId}
                  onChange={e => setFormUser(prev => ({ ...prev, deviceId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none font-mono text-xs focus:border-indigo-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Provides hardware binding lock. User won't be able to log in using another SFA device.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Save User ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
