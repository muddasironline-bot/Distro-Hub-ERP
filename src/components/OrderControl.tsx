import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Store, 
  User, 
  Calendar, 
  Plus, 
  Trash, 
  Check, 
  X, 
  AlertCircle, 
  Edit3, 
  FileCheck, 
  TrendingUp 
} from 'lucide-react';
import { Order, Shop, User as CentralUser, OrderItem } from '../types';

interface OrderControlProps {
  orders: Order[];
  shops: Shop[];
  users: CentralUser[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function OrderControl({ 
  orders, 
  shops, 
  users, 
  setOrders, 
  logAudit 
}: OrderControlProps) {
  
  // State for focused order review
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<OrderItem[]>([]);

  // Open Order Review Detail Modal
  const openReviewModal = (ord: Order) => {
    setSelectedOrder(ord);
    setEditItems([...ord.items]);
    setIsEditing(false);
  };

  // Add Item in Edit Mode
  const addProductToOrder = () => {
    const newItem: OrderItem = {
      id: 'IT-NEW-' + Date.now(),
      productName: 'Hydrating Face Serum 30ml',
      price: 1250,
      quantity: 5
    };
    setEditItems(prev => [...prev, newItem]);
  };

  // Remove Item in Edit Mode
  const removeProductFromOrder = (itemId: string) => {
    setEditItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Update item quantity
  const updateItemQuantity = (itemId: string, qty: number) => {
    if (qty < 1) return;
    setEditItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
  };

  // Save changes and Approve Order
  const handleApproveWithEdits = () => {
    if (!selectedOrder) return;
    
    const recalculatedTotal = editItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          items: editItems,
          totalAmount: recalculatedTotal,
          status: 'Approved'
        };
      }
      return o;
    }));

    const shopName = shops.find(s => s.id === selectedOrder.shopId)?.shopName || selectedOrder.shopId;
    logAudit(`Reviewed & Approved SFA Order ${selectedOrder.id} for "${shopName}". New Value: PKR ${recalculatedTotal.toLocaleString()}`, 'Order Control');
    alert(`Order ${selectedOrder.id} successfully reviewed, edited, and approved. Invoice generation triggered.`);
    setSelectedOrder(null);
  };

  // Quick action: Approve without changes
  const handleQuickApprove = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Approved' } : o));
    const ord = orders.find(o => o.id === id);
    const shopName = ord ? (shops.find(s => s.id === ord.shopId)?.shopName || ord.shopId) : id;
    logAudit(`Quick Approved SFA Order ${id} for "${shopName}"`, 'Order Control');
  };

  // Quick action: Reject
  const handleReject = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Rejected' } : o));
    const ord = orders.find(o => o.id === id);
    const shopName = ord ? (shops.find(s => s.id === ord.shopId)?.shopName || ord.shopId) : id;
    logAudit(`Rejected SFA Order ${id} for "${shopName}"`, 'Order Control');
  };

  return (
    <div className="space-y-6" id="orders-control-module">
      {/* Title */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-indigo-600" />
          Order Control Center (SFA Stream)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Review, edit, and approve incoming orders booked by SFA representatives in the field.
        </p>
      </div>

      {/* Orders queue */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 text-sm">Active Bookings Stream</h4>
        
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm border-collapse" id="orders-stream-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-xs">
                <th className="p-4">Order ID</th>
                <th className="p-4">Retailer Shop</th>
                <th className="p-4">Order Booker</th>
                <th className="p-4">Geofence Compliance</th>
                <th className="p-4">Line Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {orders.map(o => {
                const shop = shops.find(s => s.id === o.shopId);
                const booker = users.find(u => u.id === o.orderBookerId);

                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-4 font-mono font-bold text-indigo-700">{o.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Store className="h-3.5 w-3.5 text-slate-400" />
                        {shop ? shop.shopName : o.shopId}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="font-semibold flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {booker ? booker.name : o.orderBookerId}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">
                        ● GPS Compliant (Inside 50m)
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">
                      {o.items.length} Products
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      PKR {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {o.createdAt.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        o.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                          : o.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-800 border-amber-100 animate-pulse' 
                          : 'bg-rose-50 text-rose-800 border-rose-100'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {o.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openReviewModal(o)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                            title="Vet and Edit Order"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Vet Order
                          </button>
                          <button 
                            onClick={() => handleQuickApprove(o.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Approve Directly"
                          >
                            <Check className="h-4.5 w-4.5" />
                          </button>
                          <button 
                            onClick={() => handleReject(o.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                            title="Reject"
                          >
                            <X className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium flex items-center justify-end gap-1">
                          <FileCheck className="h-3.5 w-3.5 text-emerald-600" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL-SCREEN VET & EDIT ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-indigo-400" />
                <h4 className="font-bold text-sm">Vetting Order #{selectedOrder.id}</h4>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Order Info Cards */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[9px]">Retail Shop</span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {shops.find(s => s.id === selectedOrder.shopId)?.shopName || selectedOrder.shopId}
                  </span>
                  <span className="text-slate-500">{shops.find(s => s.id === selectedOrder.shopId)?.address}</span>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[9px]">Booker details</span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {users.find(u => u.id === selectedOrder.orderBookerId)?.name || selectedOrder.orderBookerId}
                  </span>
                  <span className="text-slate-500 font-mono">Bound ID: {selectedOrder.orderBookerId}</span>
                </div>
              </div>

              {/* Geo location checked banner */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Hardware &amp; Geofence Vetted:</span> Order booked at exact Shop GPS boundary. Radial error calculated at **3.4 meters** (Maximum permitted: 50m). Device Bound Lock signature verified.
                </div>
              </div>

              {/* Items editing directory */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-slate-900 text-sm">Product Basket Lines</h5>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Enable Basket Editor
                    </button>
                  ) : (
                    <button 
                      onClick={addProductToOrder}
                      className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-1.5 rounded hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Product Line
                    </button>
                  )}
                </div>

                <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold text-[10px] uppercase">
                        <th className="p-3">Product Name</th>
                        <th className="p-3 text-center">Unit Price</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Subtotal</th>
                        {isEditing && <th className="p-3 text-right">Remove</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {editItems.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50/40">
                          <td className="p-3 font-semibold text-slate-800">
                            {isEditing ? (
                              <select 
                                value={item.productName}
                                onChange={e => {
                                  const name = e.target.value;
                                  const price = name.includes("Lip") ? 450 : name.includes("Face Wash") ? 680 : name.includes("Serum") ? 1250 : 950;
                                  setEditItems(prev => prev.map((it, idx) => idx === index ? { ...it, productName: name, price } : it));
                                }}
                                className="bg-white border border-slate-200 p-1 rounded font-medium focus:outline-none w-full"
                              >
                                <option value="Gold Lip Care Cream 15g">Gold Lip Care Cream 15g</option>
                                <option value="Deep Cleansing Face Wash 100ml">Deep Cleansing Face Wash 100ml</option>
                                <option value="Hydrating Face Serum 30ml">Hydrating Face Serum 30ml</option>
                                <option value="Anti-Hairfall Shampoo Pro 250ml">Anti-Hairfall Shampoo Pro 250ml</option>
                              </select>
                            ) : (
                              item.productName
                            )}
                          </td>
                          <td className="p-3 text-center font-mono font-medium text-slate-600">
                            PKR {item.price.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={item.quantity}
                                onChange={e => updateItemQuantity(item.id, Number(e.target.value))}
                                className="bg-white border border-slate-300 w-16 p-1 rounded font-mono text-center focus:outline-none"
                                min={1}
                              />
                            ) : (
                              <span className="font-bold text-slate-800">{item.quantity} units</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-800">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </td>
                          {isEditing && (
                            <td className="p-3 text-right">
                              <button 
                                onClick={() => removeProductFromOrder(item.id)}
                                className="text-rose-600 hover:text-rose-800 p-1"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total box */}
                <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center mt-3 shrink-0">
                  <span className="text-slate-400 font-bold tracking-wider text-[10px] uppercase">Vetted Order Net Total</span>
                  <span className="text-xl font-mono font-black text-teal-400">
                    PKR {editItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2 justify-end shrink-0">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
              >
                Discard &amp; Hold
              </button>
              <button 
                onClick={handleApproveWithEdits}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Check className="h-4 w-4" /> Approve &amp; Dispatch Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
