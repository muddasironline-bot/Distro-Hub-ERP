export type LicenseType = 'Trial' | 'Monthly' | 'Yearly' | 'Lifetime';
export type UserRole = 
  | 'Super Admin' 
  | 'Company Admin' 
  | 'Manager' 
  | 'Supervisor' 
  | 'Accountant' 
  | 'Warehouse Manager' 
  | 'Operations User' 
  | 'Order Booker' 
  | 'Supply Man';

export type UserStatus = 'Active' | 'Deactivated' | 'Suspended';

export interface Company {
  id: string;
  name: string;
  status: 'Active' | 'Suspended';
}

export interface User {
  id: string; // Login ID like OB-0001, SM-0001
  name: string;
  role: UserRole;
  status: UserStatus;
  distributionId: string;
  routeId: string;
  deviceId: string; // Bound Device IMEI or UUID
}

export interface License {
  id: string;
  companyName: string;
  type: LicenseType;
  activationDate: string;
  expiryDate: string;
  deviceLimit: number;
  userLimit: number;
  digitalSignature: string;
  status: 'Active' | 'Suspended' | 'Revoked' | 'Expired';
}

export interface Shop {
  id: string;
  shopName: string;
  ownerName: string;
  mobile: string;
  address: string;
  latitude: number;
  longitude: number;
  geoRadius: number; // in meters
  creditLimit: number;
  outstandingBalance: number;
  routeId: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Route {
  id: string;
  name: string;
  area: string;
  beatPlan: string; // e.g., 'Mon/Thu Beat'
  assignedEmployeeId: string;
}

export interface RouteHistory {
  id: string;
  routeId: string;
  shopId: string;
  previousRouteId: string;
  newRouteId: string;
  transferredBy: string;
  timestamp: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // e.g., ORD-1001
  shopId: string;
  orderBookerId: string;
  items: OrderItem[];
  status: 'Pending' | 'Approved' | 'Rejected';
  totalAmount: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  distributionId: string;
  productName: string;
  openingStock: number;
  purchased: number;
  transferred: number;
  damaged: number;
  expired: number;
  warehouseStock: number;
}

export interface AccountVoucher {
  id: string;
  date: string;
  type: 'Customer Ledger' | 'Cash Book' | 'Bank Book' | 'Expenses' | 'Recovery' | 'Journal Vouchers';
  description: string;
  debit: number;
  credit: number;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  baseSalary: number;
  fuelAllowance: number;
  mobileAllowance: number;
  incentives: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending' | 'On Hold';
}

export interface GpsLog {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  latitude: number;
  longitude: number;
  currentShop: string;
  visitDuration: string; // e.g. "12m"
  routeProgress: number; // percentage
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
}
