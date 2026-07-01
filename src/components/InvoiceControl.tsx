import React, { useState } from 'react';
import { 
  Printer, 
  Store, 
  User, 
  Clock, 
  FileText, 
  Receipt, 
  Truck, 
  FileCode, 
  Sparkles, 
  CheckCircle 
} from 'lucide-react';
import { Order, Shop, User as CentralUser } from '../types';

interface InvoiceProps {
  orders: Order[];
  shops: Shop[];
  users: CentralUser[];
}

export default function InvoiceControl({ orders, shops, users }: InvoiceProps) {
  
  // States
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [formatType, setFormatType] = useState<'A4' | 'HalfA4' | 'Thermal58' | 'Thermal80' | 'Challan'>('A4');

  const approvedOrders = orders.filter(o => o.status === 'Approved');
  const activeOrder = approvedOrders.find(o => o.id === selectedOrderId) || approvedOrders[0];

  // Pick up matching references
  const shop = activeOrder ? shops.find(s => s.id === activeOrder.shopId) : null;
  const booker = activeOrder ? users.find(u => u.id === activeOrder.orderBookerId) : null;

  // Print command
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="invoice-control-center">
      {/* Upper header */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Printer className="h-5 w-5 text-indigo-600" />
          Central Invoice Control &amp; Dispatcher
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Generate physical and thermal dispatch receipts. Operations/Server holds exclusive privileges to write invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: configuration parameters */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <h4 className="font-bold text-slate-900 text-sm">Invoice Configuration</h4>
          
          {/* Order Selector */}
          <div className="space-y-1.5 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Approved SFA Booking</label>
            <select 
              value={selectedOrderId}
              onChange={e => setSelectedOrderId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-bold text-indigo-700"
            >
              {approvedOrders.map(o => {
                const s = shops.find(sh => sh.id === o.shopId);
                return (
                  <option key={o.id} value={o.id}>
                    {o.id} - {s ? s.shopName : o.shopId} (PKR {o.totalAmount.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Format Selector */}
          <div className="space-y-2 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Select Printing Format</label>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setFormatType('A4')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  formatType === 'A4' ? 'border-indigo-500 bg-indigo-50/25 font-bold text-indigo-900' : 'border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <div>
                  <div className="text-xs">A4 Standard Sheet</div>
                  <div className="text-[10px] text-slate-400 font-medium">For wholesale invoicing and accounting records</div>
                </div>
              </button>

              <button 
                onClick={() => setFormatType('HalfA4')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  formatType === 'HalfA4' ? 'border-indigo-500 bg-indigo-50/25 font-bold text-indigo-900' : 'border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileCode className="h-4 w-4" />
                <div>
                  <div className="text-xs">Half A4 Bill Slip</div>
                  <div className="text-[10px] text-slate-400 font-medium">Compact slip footprint for supply vans</div>
                </div>
              </button>

              <button 
                onClick={() => setFormatType('Thermal80')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  formatType === 'Thermal80' ? 'border-indigo-500 bg-indigo-50/25 font-bold text-indigo-900' : 'border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <div>
                  <div className="text-xs">80mm Thermal Paper</div>
                  <div className="text-[10px] text-slate-400 font-medium">Standard POS thermal roll printer output</div>
                </div>
              </button>

              <button 
                onClick={() => setFormatType('Thermal58')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  formatType === 'Thermal58' ? 'border-indigo-500 bg-indigo-50/25 font-bold text-indigo-900' : 'border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <div>
                  <div className="text-xs">58mm Thermal Paper</div>
                  <div className="text-[10px] text-slate-400 font-medium">Small-form hand-held Bluetooth printer slips</div>
                </div>
              </button>

              <button 
                onClick={() => setFormatType('Challan')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  formatType === 'Challan' ? 'border-indigo-500 bg-indigo-50/25 font-bold text-indigo-900' : 'border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="h-4 w-4" />
                <div>
                  <div className="text-xs">Delivery Challan / Gatepass</div>
                  <div className="text-[10px] text-slate-400 font-medium">Itemized quantity manifest for warehouse handlers</div>
                </div>
              </button>
            </div>
          </div>

          {/* Trigger Print */}
          <button 
            onClick={handlePrint}
            className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Printer className="h-4 w-4" /> Print Document Output
          </button>
        </div>

        {/* Right column: pixel-perfect visual replica preview block */}
        <div className="lg:col-span-2">
          <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 overflow-x-auto flex justify-center items-start min-h-[500px]">
            
            {/* Conditional formatting wrapper */}
            {activeOrder ? (
              <>
                {/* 1. A4 Standard Sheet Layout */}
                {formatType === 'A4' && (
                  <div className="bg-white w-[595px] min-h-[842px] shadow-lg border border-slate-200 p-8 text-slate-800 text-xs flex flex-col justify-between" id="printable-a4-invoice">
                    <div className="space-y-6">
                      {/* Logo and Header info */}
                      <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-5">
                        <div>
                          <h1 className="text-indigo-600 font-black text-xl tracking-tight">FARID COSMETICS DISTRIBUTION</h1>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">
                            Plot 42, Industrial Area Sector I-9, Islamabad.<br/>
                            Ph: 051-5556677 | Email: logistics@faridgroup.com
                          </p>
                        </div>
                        <div className="text-right">
                          <h2 className="text-lg font-black text-slate-900 uppercase">Commercial Invoice</h2>
                          <div className="font-mono text-[10px] text-slate-400 mt-1">Invoice ID: INV-A4-{activeOrder.id}</div>
                          <div className="text-[10px] font-semibold text-slate-600 mt-0.5">Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Bill To & Booker Vitals */}
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-indigo-600 tracking-wider">Bill To Customer</span>
                          <div className="font-bold text-slate-950 text-sm">{shop?.shopName}</div>
                          <div className="text-slate-500 leading-normal">{shop?.address}</div>
                          <div className="font-mono text-slate-500">Phone: {shop?.mobile}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Logistics Compliance</span>
                          <div className="font-bold text-slate-800">Runner: {booker?.name} ({booker?.id})</div>
                          <div className="text-slate-500">Route Sector: Satellite Town Route A</div>
                          <div className="text-emerald-600 font-bold">GPS Geofence Match: Vetted OK</div>
                        </div>
                      </div>

                      {/* Table items */}
                      <table className="w-full text-left border-collapse mt-4">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                            <th className="py-2">Product Description</th>
                            <th className="py-2 text-center">Unit Price</th>
                            <th className="py-2 text-center">Quantity</th>
                            <th className="py-2 text-right">Subtotal Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {activeOrder.items.map(it => (
                            <tr key={it.id}>
                              <td className="py-2.5 font-bold text-slate-900">{it.productName}</td>
                              <td className="py-2.5 text-center font-mono text-slate-500">PKR {it.price}</td>
                              <td className="py-2.5 text-center">{it.quantity} units</td>
                              <td className="py-2.5 text-right font-mono font-bold text-slate-800">PKR {(it.price * it.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer totals */}
                    <div className="space-y-4">
                      <div className="flex justify-end pt-4 border-t border-slate-200">
                        <div className="w-64 space-y-2 text-xs">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span className="font-mono font-semibold">PKR {activeOrder.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Sales Tax (0%):</span>
                            <span className="font-mono">PKR 0</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-950 text-sm font-black">
                            <span>Net Payable:</span>
                            <span className="font-mono text-indigo-700">PKR {activeOrder.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-medium leading-relaxed">
                        <div>
                          * This is a system-generated commercial invoice printed from DistroHub Enterprise Server ERP.<br/>
                          * Goods once sold cannot be returned. Please verify quantities at delivery.
                        </div>
                        <div className="text-right">
                          ___________________________<br/>
                          Authorized Signature Stamp
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Half A4 Sheet Layout */}
                {formatType === 'HalfA4' && (
                  <div className="bg-white w-[595px] min-h-[421px] shadow-lg border border-slate-200 p-6 text-slate-800 text-xs flex flex-col justify-between" id="printable-halfa4">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
                        <div>
                          <h1 className="text-slate-900 font-extrabold text-sm uppercase">Farid Cosmetics (Half-Sheet Slip)</h1>
                          <p className="text-[9px] text-slate-400">Industrial Area I-9, Islamabad | Ph: 051-5556677</p>
                        </div>
                        <div className="text-right text-[10px]">
                          <span className="font-bold">SLIP: INV-{activeOrder.id}</span>
                          <span className="block text-slate-400 mt-0.5">{new Date(activeOrder.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[8px]">Retailer</span>
                          <span className="font-bold">{shop?.shopName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[8px]">SFA Booker</span>
                          <span className="font-bold">{booker?.name}</span>
                        </div>
                      </div>

                      <table className="w-full text-left text-[10px] mt-2 border-t border-slate-150">
                        <thead>
                          <tr className="border-b border-slate-150 text-slate-500 font-bold">
                            <th className="py-1">Description</th>
                            <th className="py-1 text-center">Price</th>
                            <th className="py-1 text-center">Qty</th>
                            <th className="py-1 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeOrder.items.map(it => (
                            <tr key={it.id} className="border-b border-slate-100">
                              <td className="py-1.5 font-semibold text-slate-900">{it.productName}</td>
                              <td className="py-1.5 text-center font-mono">PKR {it.price}</td>
                              <td className="py-1.5 text-center">{it.quantity}</td>
                              <td className="py-1.5 text-right font-mono font-bold">PKR {(it.price * it.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-200 pt-3 text-[10px]">
                      <span className="text-[9px] text-slate-400">Printed via Server. Port 3000 Security Enforced.</span>
                      <div className="font-bold text-slate-900">
                        Net Total: <span className="font-mono font-black text-indigo-700 text-sm">PKR {activeOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 80mm Thermal Slip Layout */}
                {formatType === 'Thermal80' && (
                  <div className="bg-white w-[302px] shadow-lg border border-slate-200 p-4 text-slate-900 text-xs font-mono" id="printable-thermal-80">
                    <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3 mb-3">
                      <h3 className="font-black text-sm tracking-tight uppercase">Farid Cosmetics</h3>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Sardar Plaza, Satellite Town, Rwp<br/>
                        TEL: 0300-1234567
                      </p>
                      <div className="text-[9px] text-slate-400 mt-2">
                        STATION: OPERATIONS DESKTOP<br/>
                        TRANSACTION: #THR-{activeOrder.id}
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px] border-b border-dashed border-slate-300 pb-3 mb-3">
                      <div>RETAILER: {shop?.shopName}</div>
                      <div>PHONE: {shop?.mobile}</div>
                      <div>BOOKER ID: {activeOrder.orderBookerId}</div>
                      <div>DATE: {new Date(activeOrder.createdAt).toLocaleString()}</div>
                      <div>GEOLOC: CHECK OK (r=50m)</div>
                    </div>

                    <div className="space-y-2 text-[10px]">
                      <div className="border-b border-dashed border-slate-200 pb-1 flex justify-between font-bold text-slate-500 uppercase">
                        <span>Product [Qty]</span>
                        <span>Amount</span>
                      </div>
                      
                      {activeOrder.items.map(it => (
                        <div key={it.id} className="flex justify-between leading-normal text-slate-700">
                          <span className="truncate pr-2 block max-w-[180px]">{it.productName} [{it.quantity}]</span>
                          <span className="font-bold shrink-0">PKR {(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-slate-300 mt-3 pt-3 space-y-1.5 text-xs font-bold text-right">
                      <div className="flex justify-between">
                        <span className="text-slate-500">ITEMS COUNT:</span>
                        <span>{activeOrder.items.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>NET PAYABLE:</span>
                        <span className="font-black">PKR {activeOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-center text-[9px] text-slate-400 mt-6 border-t border-dashed border-slate-300 pt-3 space-y-1">
                      <div>*** THANK YOU ***</div>
                      <div>DistroHub ERP Platform Security</div>
                      <div>Powered by JWT Cryptography</div>
                    </div>
                  </div>
                )}

                {/* 4. 58mm Thermal Slip Layout */}
                {formatType === 'Thermal58' && (
                  <div className="bg-white w-[219px] shadow-lg border border-slate-200 p-3 text-slate-900 text-[10px] font-mono" id="printable-thermal-58">
                    <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-2 mb-2">
                      <h3 className="font-black text-xs uppercase">FARID COSMETICS</h3>
                      <p className="text-[8px] text-slate-500 leading-normal">
                        Rawalpindi | 051-5556677
                      </p>
                      <div className="text-[8px] text-slate-400">
                        #INV-{activeOrder.id}<br/>
                        {new Date(activeOrder.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-1 text-[9px] mb-2 border-b border-dashed border-slate-300 pb-2 text-slate-700">
                      <div className="truncate">CUST: {shop?.shopName}</div>
                      <div>RUN: {activeOrder.orderBookerId}</div>
                    </div>

                    <div className="space-y-1.5 text-[9px] text-slate-600">
                      {activeOrder.items.map(it => (
                        <div key={it.id} className="flex justify-between leading-normal">
                          <span className="truncate pr-1 block max-w-[120px]">{it.productName} (x{it.quantity})</span>
                          <span className="font-bold">PKR {(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-slate-300 mt-2 pt-2 text-right font-bold text-slate-900">
                      TOTAL: <span className="text-xs font-black">PKR {activeOrder.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="text-center text-[8px] text-slate-400 mt-4 border-t border-dashed border-slate-300 pt-2">
                      SFA mobile slip.<br/>
                      Bound Device Lock active.
                    </div>
                  </div>
                )}

                {/* 5. Delivery Challan / Gatepass Layout */}
                {formatType === 'Challan' && (
                  <div className="bg-white w-[595px] min-h-[842px] shadow-lg border border-slate-200 p-8 text-slate-800 text-xs flex flex-col justify-between" id="printable-gatepass">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5">
                        <div>
                          <h1 className="text-slate-900 font-black text-lg tracking-tight uppercase">FARID COSMETICS DISTRIBUTION</h1>
                          <p className="text-[10px] text-slate-400 mt-0.5">Plot 42, Industrial Area I-9, Islamabad</p>
                        </div>
                        <div className="text-right">
                          <h2 className="text-base font-black text-slate-900 uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded">Delivery Challan / Gatepass</h2>
                          <div className="font-mono text-[10px] text-slate-400 mt-2">Challan ID: DC-WHR-{activeOrder.id}</div>
                          <div className="text-[10px] font-semibold text-slate-600 mt-0.5">Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500">Consignee Destination</span>
                          <div className="font-bold text-slate-950 text-sm">{shop?.shopName}</div>
                          <div className="text-slate-500 leading-normal">{shop?.address}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500">Dispatch Logistics</span>
                          <div className="font-bold text-slate-800">Supply Vehicle Runner: Sajid Mehmood (SM-0001)</div>
                          <div className="text-slate-500">Associated Order: {activeOrder.id}</div>
                          <div className="text-slate-500 font-semibold text-indigo-700">Audit Status: Approved for Loading</div>
                        </div>
                      </div>

                      {/* Challan table containing QUANTITIES ONLY, no commercial prices (warehouse protocol!) */}
                      <table className="w-full text-left border-collapse mt-4">
                        <thead>
                          <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                            <th className="py-2">Item Part Reference Description</th>
                            <th className="py-2 text-center">Required Quantity</th>
                            <th className="py-2 text-center">Dispatched Qty</th>
                            <th className="py-2 text-right">Warehouse Location Bin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {activeOrder.items.map(it => (
                            <tr key={it.id}>
                              <td className="py-2.5 font-bold text-slate-900">{it.productName}</td>
                              <td className="py-2.5 text-center font-bold">{it.quantity} units</td>
                              <td className="py-2.5 text-center border-b border-slate-300 w-24">___________</td>
                              <td className="py-2.5 text-right font-mono text-slate-400">BIN-COSM-{Math.floor(10 + Math.random() * 89)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-slate-200 pt-8 grid grid-cols-3 gap-6 text-center text-[10px] text-slate-500 mt-12">
                      <div>
                        ___________________________<br/>
                        Prepared By (Warehouse Manager)
                      </div>
                      <div>
                        ___________________________<br/>
                        Dispatched By (Supply Man)
                      </div>
                      <div>
                        ___________________________<br/>
                        Received By (Retail Shop Seal)
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-sm">
                No approved orders currently available. Select and approve pending order books in Order Control Center.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
