import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  FileText, 
  Filter,
  X
} from 'lucide-react';
import { AccountVoucher } from '../types';

interface AccountsProps {
  accounts: AccountVoucher[];
  setAccounts: React.Dispatch<React.SetStateAction<AccountVoucher[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function AccountsModule({ 
  accounts, 
  setAccounts, 
  logAudit 
}: AccountsProps) {
  
  // States
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [newVoucher, setNewVoucher] = useState({
    type: 'Cash Book' as AccountVoucher['type'],
    description: '',
    debit: 0,
    credit: 0
  });

  // Calculate stats
  const totalDebit = accounts.reduce((sum, v) => sum + v.debit, 0);
  const totalCredit = accounts.reduce((sum, v) => sum + v.credit, 0);
  const netBalance = totalDebit - totalCredit;

  // Save Voucher Action
  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucher.description.trim()) return;

    const voucherId = `VOU-${Math.floor(500 + Math.random() * 500)}`;
    const voucher: AccountVoucher = {
      id: voucherId,
      date: new Date().toISOString().split('T')[0],
      type: newVoucher.type,
      description: newVoucher.description,
      debit: Number(newVoucher.debit),
      credit: Number(newVoucher.credit)
    };

    setAccounts(prev => [voucher, ...prev]);
    logAudit(`Posted Ledger Voucher ${voucherId} of type "${newVoucher.type}". Value: Dr: ${newVoucher.debit} | Cr: ${newVoucher.credit}`, 'Accounts');
    setShowVoucherModal(false);
    setNewVoucher({
      type: 'Cash Book',
      description: '',
      debit: 0,
      credit: 0
    });
  };

  // Filter vouchers
  const filteredVouchers = accounts.filter(v => {
    if (activeFilter === 'All') return true;
    return v.type === activeFilter;
  });

  return (
    <div className="space-y-6" id="accounts-module">
      {/* Overview stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block uppercase">Total Debits</span>
            <span className="text-xl font-bold font-mono text-emerald-600 block mt-1">PKR {totalDebit.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ArrowUpRight className="h-5.5 w-5.5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block uppercase">Total Credits</span>
            <span className="text-xl font-bold font-mono text-rose-600 block mt-1">PKR {totalCredit.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <ArrowDownRight className="h-5.5 w-5.5" />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block uppercase">Net Liquid Balance</span>
            <span className="text-xl font-black font-mono text-teal-400 block mt-1">PKR {netBalance.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-800 text-teal-400 rounded-lg">
            <DollarSign className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* Title & Action Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Double Entry Ledger &amp; Cashbooks
          </h3>
          <p className="text-xs text-slate-500">
            Write general ledger accounts, verify cash in hand and post adjustments using standard GAAP debit/credit accounting.
          </p>
        </div>
        <button 
          onClick={() => setShowVoucherModal(true)}
          className="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5 self-start shadow-xs"
        >
          <Plus className="h-4 w-4" /> Post New Voucher
        </button>
      </div>

      {/* Filter and Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200">
          <Filter className="h-4 w-4 text-slate-400 mr-2" />
          {['All', 'Customer Ledger', 'Cash Book', 'Bank Book', 'Expenses', 'Recovery', 'Journal Vouchers'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activeFilter === f 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm border-collapse" id="ledgers-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs">
                <th className="p-4">Voucher Reference</th>
                <th className="p-4">Voucher Date</th>
                <th className="p-4">Subledger Class</th>
                <th className="p-4">Narrative Description</th>
                <th className="p-4 text-right">Debit (Dr)</th>
                <th className="p-4 text-right">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVouchers.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-all font-medium">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {v.id}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{v.date}</td>
                  <td className="p-4">
                    <span className="bg-blue-50/50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full font-bold">
                      {v.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-800 font-bold">{v.description}</td>
                  <td className="p-4 text-right font-mono text-emerald-600 font-black">
                    {v.debit > 0 ? `PKR ${v.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="p-4 text-right font-mono text-rose-600 font-black">
                    {v.credit > 0 ? `PKR ${v.credit.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POST VOUCHER MODAL */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">Post Double Entry Voucher</h4>
              <button onClick={() => setShowVoucherModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoucher} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ledger Category</label>
                <select 
                  value={newVoucher.type}
                  onChange={e => setNewVoucher(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                >
                  <option value="Customer Ledger">Customer Ledger</option>
                  <option value="Cash Book">Cash Book</option>
                  <option value="Bank Book">Bank Book</option>
                  <option value="Expenses">Expenses</option>
                  <option value="Recovery">Recovery Record</option>
                  <option value="Journal Vouchers">Journal Vouchers</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Narrative Description *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cleared Allied Bank invoice 102"
                  value={newVoucher.description}
                  onChange={e => setNewVoucher(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Debit Amount (Dr)</label>
                  <input 
                    type="number" 
                    value={newVoucher.debit}
                    onChange={e => setNewVoucher(prev => ({ ...prev, debit: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-mono"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Credit Amount (Cr)</label>
                  <input 
                    type="number" 
                    value={newVoucher.credit}
                    onChange={e => setNewVoucher(prev => ({ ...prev, credit: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-mono"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowVoucherModal(false)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
