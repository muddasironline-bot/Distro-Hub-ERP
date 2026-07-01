import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Map, 
  Users, 
  Database, 
  Compass, 
  BarChart2, 
  ArrowUpRight, 
  Printer 
} from 'lucide-react';
import { Shop, Order, AccountVoucher } from '../types';

interface ReportsProps {
  orders: Order[];
  shops: Shop[];
  accounts: AccountVoucher[];
}

type ReportType = 
  | 'Sales' 
  | 'Recovery' 
  | 'Stock' 
  | 'GPS' 
  | 'Attendance' 
  | 'Route Compliance' 
  | 'Performance' 
  | 'Profitability';

export default function ReportsCenter({ orders, shops, accounts }: ReportsProps) {
  
  // States
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('Sales');
  const [reportRange, setReportRange] = useState('Today');

  // Trigger export logs
  const handleExport = (format: 'CSV' | 'Excel' | 'JSON') => {
    alert(`Generating system-grade exported logs for "${selectedReportType} Report" in **.${format}** structure...`);
  };

  return (
    <div className="space-y-6" id="reports-center">
      {/* Upper header */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-indigo-600" />
          Central Business Intelligence &amp; Reports Center
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Vetting operations metrics. Select any of the 8 enterprise-grade analytics registers, scope date ranges, and export spreadsheet manifests.
        </p>
      </div>

      {/* Scope configuration row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Report Module</label>
          <select 
            value={selectedReportType}
            onChange={e => setSelectedReportType(e.target.value as ReportType)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none"
          >
            <option value="Sales">Sales Report Register</option>
            <option value="Recovery">Recovery Collection Ledger</option>
            <option value="Stock">Stock &amp; Warehouse Levels Report</option>
            <option value="GPS">GPS Geofence Tracking Audits</option>
            <option value="Attendance">Attendance &amp; Check-In Registry</option>
            <option value="Route Compliance">Route &amp; Beat Schedule Compliance</option>
            <option value="Performance">Employee Performance Index</option>
            <option value="Profitability">Gross Profitability Index</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date Scope Filter</label>
          <select 
            value={reportRange}
            onChange={e => setReportRange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none"
          >
            <option value="Today">Today (Active Session)</option>
            <option value="Yesterday">Yesterday</option>
            <option value="M-T-D">Month-To-Date (MTD)</option>
            <option value="Yearly">Financial Year 2026</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button 
            onClick={() => handleExport('CSV')}
            className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button 
            onClick={() => handleExport('Excel')}
            className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-950 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Report Tables Container */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm">{selectedReportType} Audit Sheet ({reportRange})</h4>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
            Live Database
          </span>
        </div>

        {/* 1. SALES REPORT */}
        {selectedReportType === 'Sales' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Order Code</th>
                  <th className="p-3">Retail Shop Name</th>
                  <th className="p-3">Authorized Booker</th>
                  <th className="p-3 text-center">Lines Booked</th>
                  <th className="p-3 text-right">Order Subtotal</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/40">
                    <td className="p-3 font-mono font-bold text-indigo-700">{o.id}</td>
                    <td className="p-3 font-bold text-slate-900">{shops.find(s => s.id === o.shopId)?.shopName || o.shopId}</td>
                    <td className="p-3 text-slate-600">{o.orderBookerId}</td>
                    <td className="p-3 text-center">{o.items.length} Lines</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">PKR {o.totalAmount.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. RECOVERY REPORT */}
        {selectedReportType === 'Recovery' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Voucher Ref</th>
                  <th className="p-3">Receipt Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Debit Recieved (Dr)</th>
                  <th className="p-3 text-right">Credit Settled (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {accounts.filter(a => a.type === 'Recovery').map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/40">
                    <td className="p-3 font-mono font-bold text-indigo-700">{v.id}</td>
                    <td className="p-3 font-mono text-slate-400">{v.date}</td>
                    <td className="p-3 font-bold text-slate-900">{v.description}</td>
                    <td className="p-3 text-right font-mono text-emerald-600 font-black">PKR {v.debit.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. STOCK LEVEL REPORT */}
        {selectedReportType === 'Stock' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Net Warehouse Assets</span>
              <span className="font-mono text-teal-400 font-bold">5 SKUs Active | Totaling 5,243 Units</span>
            </div>
            <div className="text-slate-500 text-xs italic">
              Please open the **Inventory** tab to inspect full details of opening balance, transfers, expiries, and scapped returns of active cosmetic and food lines.
            </div>
          </div>
        )}

        {/* 4. GPS REPORT */}
        {selectedReportType === 'GPS' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Field Employee</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">GPS Latitude</th>
                  <th className="p-3">GPS Longitude</th>
                  <th className="p-3">Current Retailer Location</th>
                  <th className="p-3 text-center">Compliance Checked Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Zia-ur-Rehman (OB-0001)</td>
                  <td className="p-3">Order Booker</td>
                  <td className="p-3 font-mono">33.6425 N</td>
                  <td className="p-3 font-mono">73.0784 E</td>
                  <td className="p-3">Bismillah General Store</td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full font-black text-[9px] uppercase">
                      ● Pass (Inside 50m Fence)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Imran Khan (OB-0002)</td>
                  <td className="p-3">Order Booker</td>
                  <td className="p-3 font-mono">33.5982 N</td>
                  <td className="p-3 font-mono">73.0561 E</td>
                  <td className="p-3">Kashif Super Mart</td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full font-black text-[9px] uppercase">
                      ● Pass (Inside 50m Fence)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 5. ATTENDANCE REPORT */}
        {selectedReportType === 'Attendance' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Employee Name (ID)</th>
                  <th className="p-3">SFA Check-In Time</th>
                  <th className="p-3">SFA Check-Out Time</th>
                  <th className="p-3 text-center">Active Field Hours</th>
                  <th className="p-3 text-center">Device Compliance Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Zia-ur-Rehman (OB-0001)</td>
                  <td className="p-3 font-mono text-slate-600">08:14:22 AM</td>
                  <td className="p-3 font-mono text-slate-600">04:45:10 PM</td>
                  <td className="p-3 text-center">8h 30m</td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">Device Bound IMEI Lock Valid</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Imran Khan (OB-0002)</td>
                  <td className="p-3 font-mono text-slate-600">08:05:00 AM</td>
                  <td className="p-3 font-mono text-slate-600">04:12:00 PM</td>
                  <td className="p-3 text-center font-semibold text-slate-700">8h 7m</td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">Device Bound IMEI Lock Valid</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 6. ROUTE COMPLIANCE REPORT */}
        {selectedReportType === 'Route Compliance' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Compliance Route Target</th>
                  <th className="p-3">Beat Run Days</th>
                  <th className="p-3">Planned Shops Visits</th>
                  <th className="p-3">Actual Visits Logged</th>
                  <th className="p-3">Skipped / Out-of-Sequence Shops</th>
                  <th className="p-3 text-right">Compliance Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Route-A (Satellite Town)</td>
                  <td className="p-3 font-semibold text-slate-500">Mon / Wed / Fri</td>
                  <td className="p-3 text-center font-bold">12 Retailers</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">11 Visited</td>
                  <td className="p-3 text-center text-rose-600 font-bold">1 Skipped</td>
                  <td className="p-3 text-right font-mono font-black text-indigo-700">91.6% (Compliance Pass)</td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Route-B (Saddar Cantt)</td>
                  <td className="p-3 font-semibold text-slate-500">Tue / Thu / Sat</td>
                  <td className="p-3 text-center font-bold">10 Retailers</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">10 Visited</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">0 Skipped</td>
                  <td className="p-3 text-right font-mono font-black text-indigo-700">100.0% (Perfect Beat)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 7. EMPLOYEE PERFORMANCE REPORT */}
        {selectedReportType === 'Performance' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Employee Representative</th>
                  <th className="p-3 text-center">Assigned Active Route</th>
                  <th className="p-3 text-center">Orders Booked count</th>
                  <th className="p-3 text-right">Sales Value Contributed</th>
                  <th className="p-3 text-right">Outstanding Recovered</th>
                  <th className="p-3 text-right">Calculated Performance Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Zia-ur-Rehman (OB-0001)</td>
                  <td className="p-3 text-center">Route-A</td>
                  <td className="p-3 text-center font-bold">2 Orders</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">PKR 51,880</td>
                  <td className="p-3 text-right font-mono text-emerald-600">PKR 12,500</td>
                  <td className="p-3 text-right text-emerald-600 font-extrabold">95.2% (Grade A+)</td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Imran Khan (OB-0002)</td>
                  <td className="p-3 text-center">Route-B</td>
                  <td className="p-3 text-center font-bold">1 Order</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">PKR 14,400</td>
                  <td className="p-3 text-right font-mono text-slate-400">PKR 0</td>
                  <td className="p-3 text-right text-indigo-600 font-extrabold">88.5% (Grade B)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 8. PROFITABILITY REPORT */}
        {selectedReportType === 'Profitability' && (
          <div className="overflow-x-auto rounded-xl border border-slate-100 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Distribution Revenue Stream</th>
                  <th className="p-3 text-right">Gross Sales Turnover</th>
                  <th className="p-3 text-right">Cost of Goods Sold (COGS)</th>
                  <th className="p-3 text-right">Direct Expenses (Allowances / Payroll)</th>
                  <th className="p-3 text-right text-emerald-600 font-bold">Net Distribution Profit</th>
                  <th className="p-3 text-right">Gross Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 font-bold text-slate-900">Farid Cosmetics Division</td>
                  <td className="p-3 text-right font-mono text-slate-800">PKR 51,880</td>
                  <td className="p-3 text-right font-mono text-slate-500">PKR 33,700</td>
                  <td className="p-3 text-right font-mono text-slate-500">PKR 3,200</td>
                  <td className="p-3 text-right font-mono text-emerald-600 font-black">PKR 14,980</td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-600">28.8%</td>
                </tr>
                <tr className="hover:bg-slate-50/40 font-black bg-slate-50">
                  <td className="p-3 uppercase text-slate-900">Central Cumulative Totals</td>
                  <td className="p-3 text-right font-mono text-slate-950">PKR 66,280</td>
                  <td className="p-3 text-right font-mono text-slate-700">PKR 43,100</td>
                  <td className="p-3 text-right font-mono text-slate-700">PKR 3,200</td>
                  <td className="p-3 text-right font-mono text-emerald-600">PKR 19,980</td>
                  <td className="p-3 text-right font-mono text-indigo-700">30.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
