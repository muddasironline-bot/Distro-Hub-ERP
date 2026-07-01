import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  Smartphone, 
  CheckCircle, 
  Sliders, 
  AlertCircle 
} from 'lucide-react';
import { PayrollRecord, User as CentralUser } from '../types';

interface PayrollProps {
  payroll: PayrollRecord[];
  users: CentralUser[];
  setPayroll: React.Dispatch<React.SetStateAction<PayrollRecord[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function PayrollModule({ 
  payroll, 
  users, 
  setPayroll, 
  logAudit 
}: PayrollProps) {
  
  // Fuel Rate & multiplier states
  const [fuelRate, setFuelRate] = useState(275); // PKR per Liter
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Modal editor states
  const [editRecord, setEditRecord] = useState<PayrollRecord | null>(null);

  // Trigger Payout
  const processPayout = (id: string) => {
    setPayroll(prev => prev.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    const uId = payroll.find(p => p.id === id)?.userId || id;
    const empName = users.find(u => u.id === uId)?.name || uId;
    logAudit(`Processed Payroll Payout for: "${empName}" (${uId}). Ref: ${id}`, 'Payroll');
    alert(`Salary disbursed successfully for ${empName}. Transmitted direct deposit order.`);
  };

  // Open Edit Allowance Modal
  const openEditModal = (rec: PayrollRecord) => {
    setEditRecord({ ...rec });
  };

  // Save changes from modal
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;

    const net = Number(editRecord.baseSalary) + 
                Number(editRecord.fuelAllowance) + 
                Number(editRecord.mobileAllowance) + 
                Number(editRecord.incentives) - 
                Number(editRecord.deductions);

    const updatedRecord = { ...editRecord, netSalary: net };

    setPayroll(prev => prev.map(p => p.id === editRecord.id ? updatedRecord : p));
    const empName = users.find(u => u.id === editRecord.userId)?.name || editRecord.userId;
    logAudit(`Updated compensation package and allowances for: ${empName}. Net: PKR ${net}`, 'Payroll');
    setEditRecord(null);
  };

  return (
    <div className="space-y-6" id="payroll-panel">
      {/* Title block */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Payroll &amp; Field Allowances Desk
          </h3>
          <p className="text-xs text-slate-500">
            Calculate field force compensation, disburse allowances (mobile, fuel kilometers, daily trackers), and process net salary payouts.
          </p>
        </div>
        
        {/* Sliders for Fuel price parameters */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-4 text-xs font-semibold max-w-xs w-full">
          <Sliders className="h-5 w-5 text-blue-500 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
              <span>FUEL COMPENSATE RATE</span>
              <span className="text-blue-600 font-extrabold">PKR {fuelRate}/L</span>
            </div>
            <input 
              type="range" 
              min={200} 
              max={350} 
              value={fuelRate}
              onChange={e => {
                setFuelRate(Number(e.target.value));
                logAudit(`Updated national fuel compensation rate baseline to: PKR ${e.target.value}/L`, 'Payroll');
              }}
              className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-full appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Main Table card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm border-collapse" id="payroll-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs">
                <th className="p-4">Disbursement Ref</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Employee Name</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-blue-500" /> Fuel Allow</th>
                <th className="p-4"><Smartphone className="h-3.5 w-3.5 text-blue-500" /> Mobile Allow</th>
                <th className="p-4 text-emerald-600">Performance Incentives</th>
                <th className="p-4 text-rose-600">Deductions</th>
                <th className="p-4 font-bold">Net Salary Payable</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {payroll.map(rec => {
                const emp = users.find(u => u.id === rec.userId);

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition-all font-medium">
                    <td className="p-4 font-mono font-bold text-slate-400">{rec.id}</td>
                    <td className="p-4">
                      <span className="font-mono bg-slate-100 border border-slate-200 font-bold px-2 py-0.5 rounded text-slate-700">
                        {rec.userId}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{emp ? emp.name : 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{emp ? emp.role : ''}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-700">PKR {rec.baseSalary.toLocaleString()}</td>
                    <td className="p-4 font-mono text-slate-700">PKR {rec.fuelAllowance.toLocaleString()}</td>
                    <td className="p-4 font-mono text-slate-700">PKR {rec.mobileAllowance.toLocaleString()}</td>
                    <td className="p-4 font-mono text-emerald-600">+{rec.incentives.toLocaleString()}</td>
                    <td className="p-4 font-mono text-rose-600">-{rec.deductions.toLocaleString()}</td>
                    <td className="p-4 font-mono font-black text-slate-950 text-sm">
                      PKR {rec.netSalary.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${
                        rec.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                          : rec.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-800 border-amber-100' 
                          : 'bg-rose-50 text-rose-800 border-rose-100'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openEditModal(rec)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded transition-all"
                          title="Edit Package and Allowances"
                        >
                          Modify Package
                        </button>
                        {rec.status !== 'Paid' && (
                          <button 
                            onClick={() => processPayout(rec.id)}
                            className="bg-slate-900 hover:bg-slate-950 text-white font-bold px-2 py-1 rounded transition-all"
                            title="Disburse Funds"
                          >
                            Pay Out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODIFY COMPONENT MODAL */}
      {editRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">Modify Compensation Package</h4>
              <button onClick={() => setEditRecord(null)} className="text-slate-400 hover:text-white">
                <CheckCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Updating compensation allowances for: <span className="font-bold text-slate-800">
                  {users.find(u => u.id === editRecord.userId)?.name} ({editRecord.userId})
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Base Salary</label>
                  <input 
                    type="number" 
                    value={editRecord.baseSalary}
                    onChange={e => setEditRecord(prev => prev ? ({ ...prev, baseSalary: Number(e.target.value) }) : null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold font-mono"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fuel Allowance</label>
                  <input 
                    type="number" 
                    value={editRecord.fuelAllowance}
                    onChange={e => setEditRecord(prev => prev ? ({ ...prev, fuelAllowance: Number(e.target.value) }) : null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold font-mono"
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mobile Expense</label>
                  <input 
                    type="number" 
                    value={editRecord.mobileAllowance}
                    onChange={e => setEditRecord(prev => prev ? ({ ...prev, mobileAllowance: Number(e.target.value) }) : null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold font-mono"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Incentives multiplier</label>
                  <input 
                    type="number" 
                    value={editRecord.incentives}
                    onChange={e => setEditRecord(prev => prev ? ({ ...prev, incentives: Number(e.target.value) }) : null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold font-mono text-emerald-600"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deductions (Advances / Penalties)</label>
                <input 
                  type="number" 
                  value={editRecord.deductions}
                  onChange={e => setEditRecord(prev => prev ? ({ ...prev, deductions: Number(e.target.value) }) : null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-semibold font-mono text-rose-600"
                  min={0}
                />
              </div>

              {/* Dynamic computed preview */}
              <div className="bg-slate-900 text-white rounded-xl p-3 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">ESTIMATED NET TOTAL:</span>
                <span className="font-mono text-teal-400 text-sm">
                  PKR {(Number(editRecord.baseSalary) + 
                        Number(editRecord.fuelAllowance) + 
                        Number(editRecord.mobileAllowance) + 
                        Number(editRecord.incentives) - 
                        Number(editRecord.deductions)).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditRecord(null)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
