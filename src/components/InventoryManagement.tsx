import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Building, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Share2,
  XCircle
} from 'lucide-react';
import { InventoryItem, Company } from '../types';

interface InventoryProps {
  inventory: InventoryItem[];
  companies: Company[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function InventoryManagement({ 
  inventory, 
  companies, 
  setInventory, 
  logAudit 
}: InventoryProps) {
  
  // States
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stock Adjuster values
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustType, setAdjustType] = useState<'purchased' | 'damaged' | 'expired'>('purchased');
  const [adjustQty, setAdjustQty] = useState<number>(0);

  // Apply adjustments to stock
  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingId || adjustQty <= 0) return;

    setInventory(prev => prev.map(item => {
      if (item.id === adjustingId) {
        let updatedItem = { ...item };
        if (adjustType === 'purchased') {
          updatedItem.purchased += adjustQty;
          updatedItem.warehouseStock += adjustQty;
        } else if (adjustType === 'damaged') {
          updatedItem.damaged += adjustQty;
          updatedItem.warehouseStock -= adjustQty;
        } else if (adjustType === 'expired') {
          updatedItem.expired += adjustQty;
          updatedItem.warehouseStock -= adjustQty;
        }
        return updatedItem;
      }
      return item;
    }));

    const prodName = inventory.find(i => i.id === adjustingId)?.productName || adjustingId;
    logAudit(`Manually adjusted stock of "${prodName}" for transaction of type: "${adjustType}" by qty: ${adjustQty}`, 'Inventory');
    setAdjustingId(null);
    setAdjustQty(0);
  };

  // Filter stocks
  const filteredInventory = inventory.filter(item => {
    const matchesCo = selectedCompanyFilter === 'All' || item.distributionId === selectedCompanyFilter;
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCo && matchesSearch;
  });

  return (
    <div className="space-y-6" id="inventory-manager">
      {/* Upper info banner */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          Central Warehousing &amp; Inventory Hub
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Monitor batch balances, purchase ingestions, damaged stock clearances, and expired goods disposals in real-time.
        </p>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search items in stock lists..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        {/* Company filter */}
        <div>
          <select 
            value={selectedCompanyFilter}
            onChange={e => setSelectedCompanyFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg p-2 w-full text-sm focus:outline-none font-medium"
          >
            <option value="All">All Distributions</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm border-collapse" id="inventory-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-xs">
                <th className="p-4">SKU Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Assigned Distribution House</th>
                <th className="p-4 text-center">Opening Stock Balance</th>
                <th className="p-4 text-center text-emerald-600">Purchase Additions</th>
                <th className="p-4 text-center text-indigo-600">Transit Transfers</th>
                <th className="p-4 text-center text-amber-600">Damage Returns</th>
                <th className="p-4 text-center text-rose-600">Expired Disposals</th>
                <th className="p-4 text-center bg-slate-900 text-white font-bold rounded-t-lg">Net Warehouse Stock</th>
                <th className="p-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all font-medium">
                  <td className="p-4 font-mono text-slate-400 font-bold">{item.id}</td>
                  <td className="p-4 font-bold text-slate-900 text-sm">{item.productName}</td>
                  <td className="p-4 text-slate-500 font-medium">
                    {companies.find(c => c.id === item.distributionId)?.name || item.distributionId}
                  </td>
                  <td className="p-4 text-center text-slate-700">{item.openingStock} units</td>
                  <td className="p-4 text-center text-emerald-700">+{item.purchased}</td>
                  <td className="p-4 text-center text-indigo-700">-{item.transferred}</td>
                  <td className="p-4 text-center text-amber-700">-{item.damaged}</td>
                  <td className="p-4 text-center text-rose-700">-{item.expired}</td>
                  <td className="p-4 text-center bg-slate-900 text-white font-bold font-mono">
                    {item.warehouseStock} units
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        setAdjustingId(item.id);
                        setAdjustQty(10);
                        setAdjustType('purchased');
                      }}
                      className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-all"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST STOCK MODAL */}
      {adjustingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">Stock Adjustment Panel</h4>
              <button onClick={() => setAdjustingId(null)} className="text-slate-400 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Register batch changes for SKU reference: <span className="font-bold text-slate-800">
                  {inventory.find(i => i.id === adjustingId)?.productName}
                </span>
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Adjustment Action</label>
                <select 
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                >
                  <option value="purchased">Inflow Purchase Receipt (Stock Up)</option>
                  <option value="damaged">Damage Disposal Return (Stock Down)</option>
                  <option value="expired">Expired Stock Scrap Clear (Stock Down)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quantity (Units)</label>
                <input 
                  type="number" 
                  value={adjustQty}
                  onChange={e => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none font-bold"
                  min={1}
                />
              </div>

              {/* Warning/Info Block */}
              <div className="bg-slate-100 rounded-xl p-3 text-[10px] text-slate-500 flex items-start gap-1.5 border border-slate-200">
                <AlertTriangle className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                <span>
                  Adjusting stock updates local ERP registers and affects double entry books. Audits log this adjustment trail permanently.
                </span>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setAdjustingId(null)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
