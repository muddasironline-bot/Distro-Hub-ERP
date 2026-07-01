import { Company, User, License, Shop, Route, Order, InventoryItem, AccountVoucher, PayrollRecord, GpsLog, AuditLog } from '../types';

export const initialCompanies: Company[] = [
  { id: 'COM-1', name: 'Farid Cosmetics Distribution', status: 'Active' },
  { id: 'COM-2', name: 'Farid Snacks Distribution', status: 'Active' },
  { id: 'COM-3', name: 'Farid Confectionery Distribution', status: 'Active' },
  { id: 'COM-4', name: 'Farid Beverages Distribution', status: 'Active' },
];

export const initialUsers: User[] = [
  { id: 'MG-0001', name: 'Muddasir Farid', role: 'Super Admin', status: 'Active', distributionId: 'COM-1', routeId: '', deviceId: 'DEV-UUID-9999' },
  { id: 'AC-0001', name: 'Farhan Ahmed', role: 'Accountant', status: 'Active', distributionId: 'COM-1', routeId: '', deviceId: 'DEV-UUID-7777' },
  { id: 'OB-0001', name: 'Zia-ur-Rehman', role: 'Order Booker', status: 'Active', distributionId: 'COM-1', routeId: 'R-1', deviceId: 'DEV-UUID-1001' },
  { id: 'OB-0002', name: 'Imran Khan', role: 'Order Booker', status: 'Active', distributionId: 'COM-2', routeId: 'R-2', deviceId: 'DEV-UUID-1002' },
  { id: 'SM-0001', name: 'Sajid Mehmood', role: 'Supply Man', status: 'Active', distributionId: 'COM-1', routeId: 'R-1', deviceId: 'DEV-UUID-2001' },
  { id: 'WH-0001', name: 'Kamran Shah', role: 'Warehouse Manager', status: 'Active', distributionId: 'COM-3', routeId: '', deviceId: 'DEV-UUID-3001' },
  { id: 'SP-0001', name: 'Tariq Mahmood', role: 'Supervisor', status: 'Active', distributionId: 'COM-4', routeId: 'R-3', deviceId: 'DEV-UUID-4001' },
  { id: 'OP-0001', name: 'Ayesha Bibi', role: 'Operations User', status: 'Suspended', distributionId: 'COM-1', routeId: '', deviceId: 'DEV-UUID-5001' },
];

export const initialLicenses: License[] = [
  { id: 'LIC-A1B2C3D4', companyName: 'Farid Cosmetics Distribution', type: 'Yearly', activationDate: '2026-01-01', expiryDate: '2026-12-31', deviceLimit: 15, userLimit: 30, digitalSignature: 'SIG_RSA2048_AES256_COS_9988AABCC', status: 'Active' },
  { id: 'LIC-TRIAL999', companyName: 'Farid Snacks Distribution', type: 'Trial', activationDate: '2026-06-29', expiryDate: '2026-07-01', deviceLimit: 3, userLimit: 5, digitalSignature: 'SIG_RSA2048_AES256_SNAK_7711X', status: 'Active' },
  { id: 'LIC-LIFETIME', companyName: 'Farid Confectionery Distribution', type: 'Lifetime', activationDate: '2025-05-15', expiryDate: '2099-12-31', deviceLimit: 100, userLimit: 500, digitalSignature: 'SIG_RSA2048_AES256_CONF_8822Z', status: 'Active' },
  { id: 'LIC-EXPIRED1', companyName: 'Farid Beverages Distribution', type: 'Monthly', activationDate: '2026-05-01', expiryDate: '2026-05-31', deviceLimit: 10, userLimit: 20, digitalSignature: 'SIG_RSA2048_AES256_BEV_5500P', status: 'Expired' },
];

export const initialShops: Shop[] = [
  { id: 'S-1', shopName: 'Bismillah General Store', ownerName: 'Muhammad Bilal', mobile: '0300-1234567', address: 'Block C, Satellite Town, Rawalpindi', latitude: 33.6425, longitude: 73.0784, geoRadius: 50, creditLimit: 50000, outstandingBalance: 12500, routeId: 'R-1', status: 'Approved' },
  { id: 'S-2', shopName: 'Al-Madina Cosmetics', ownerName: 'Amjad Ali', mobile: '0312-9876543', address: 'Commercial Market, Rawalpindi', latitude: 33.6394, longitude: 73.0745, geoRadius: 30, creditLimit: 150000, outstandingBalance: 64000, routeId: 'R-1', status: 'Approved' },
  { id: 'S-3', shopName: 'Kashif Super Mart', ownerName: 'Kashif Mughal', mobile: '0333-5556677', address: 'Saddar Bazar, Rawalpindi Cantt', latitude: 33.5982, longitude: 73.0561, geoRadius: 50, creditLimit: 200000, outstandingBalance: 110000, routeId: 'R-2', status: 'Approved' },
  { id: 'S-4', shopName: 'Ghausia Karyana Store', ownerName: 'Sardar Saleem', mobile: '0345-4448899', address: 'Kurri Road, Sadiqabad, Rawalpindi', latitude: 33.6218, longitude: 73.0984, geoRadius: 70, creditLimit: 30000, outstandingBalance: 5000, routeId: 'R-2', status: 'Approved' },
  { id: 'S-5', shopName: 'Zainab General Store', ownerName: 'Imtiaz Ahmed', mobile: '0321-7778811', address: '6th Road, Rawalpindi', latitude: 33.6351, longitude: 73.0892, geoRadius: 50, creditLimit: 40000, outstandingBalance: 0, routeId: 'R-3', status: 'Approved' },
  // SFA Remote inductions pending approval
  { id: 'S-IND-01', shopName: 'Peshawar Sweets & Bakers', ownerName: 'Haji Gul Zaman', mobile: '0315-8884422', address: 'Main Peshawar Road, Rawalpindi', latitude: 33.6012, longitude: 73.0125, geoRadius: 50, creditLimit: 80000, outstandingBalance: 0, routeId: 'R-1', status: 'Pending' },
  { id: 'S-IND-02', shopName: 'Royal Mart & Cash and Carry', ownerName: 'Mian Shehzad', mobile: '0322-5553311', address: 'Chaklala Scheme III, Rawalpindi', latitude: 33.5822, longitude: 73.0899, geoRadius: 100, creditLimit: 300000, outstandingBalance: 0, routeId: 'R-3', status: 'Pending' },
];

export const initialRoutes: Route[] = [
  { id: 'R-1', name: 'Route-A (Satellite Town)', area: 'Satellite Town Sector-A', beatPlan: 'Mon / Wed / Fri', assignedEmployeeId: 'OB-0001' },
  { id: 'R-2', name: 'Route-B (Saddar Cantt)', area: 'Saddar Cantonment Area', beatPlan: 'Tue / Thu / Sat', assignedEmployeeId: 'OB-0002' },
  { id: 'R-3', name: 'Route-C (Chaklala / Highway)', area: 'Chaklala & Airport Road', beatPlan: 'Daily Compliance', assignedEmployeeId: 'SP-0001' },
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    shopId: 'S-1',
    orderBookerId: 'OB-0001',
    status: 'Pending',
    createdAt: '2026-06-29T10:15:00Z',
    items: [
      { id: 'IT-1', productName: 'Gold Lip Care Cream 15g', price: 450, quantity: 12 },
      { id: 'IT-2', productName: 'Deep Cleansing Face Wash 100ml', price: 680, quantity: 6 },
      { id: 'IT-3', productName: 'Anti-Hairfall Shampoo Pro 250ml', price: 950, quantity: 10 },
    ],
    totalAmount: 18980,
  },
  {
    id: 'ORD-1002',
    shopId: 'S-2',
    orderBookerId: 'OB-0001',
    status: 'Approved',
    createdAt: '2026-06-29T11:45:00Z',
    items: [
      { id: 'IT-4', productName: 'Hydrating Face Serum 30ml', price: 1250, quantity: 10 },
      { id: 'IT-5', productName: 'Velvet Lipstick Crimson Red', price: 850, quantity: 24 },
    ],
    totalAmount: 32900,
  },
  {
    id: 'ORD-1003',
    shopId: 'S-3',
    orderBookerId: 'OB-0002',
    status: 'Approved',
    createdAt: '2026-06-29T09:30:00Z',
    items: [
      { id: 'IT-6', productName: 'Spicy Potato Wafers 50g x 48', price: 1440, quantity: 5 },
      { id: 'IT-7', productName: 'Double Choco Biscuits Pack of 12', price: 360, quantity: 20 },
    ],
    totalAmount: 14400,
  },
];

export const initialInventory: InventoryItem[] = [
  { id: 'I-1', distributionId: 'COM-1', productName: 'Gold Lip Care Cream 15g', openingStock: 500, purchased: 200, transferred: 50, damaged: 5, expired: 0, warehouseStock: 645 },
  { id: 'I-2', distributionId: 'COM-1', productName: 'Deep Cleansing Face Wash 100ml', openingStock: 300, purchased: 150, transferred: 20, damaged: 2, expired: 1, warehouseStock: 427 },
  { id: 'I-3', distributionId: 'COM-1', productName: 'Anti-Hairfall Shampoo Pro 250ml', openingStock: 400, purchased: 300, transferred: 40, damaged: 1, expired: 0, warehouseStock: 659 },
  { id: 'I-4', distributionId: 'COM-2', productName: 'Spicy Potato Wafers 50g x 48', openingStock: 1000, purchased: 500, transferred: 100, damaged: 15, expired: 10, warehouseStock: 1375 },
  { id: 'I-5', distributionId: 'COM-3', productName: 'Double Choco Biscuits Pack of 12', openingStock: 800, purchased: 400, transferred: 50, damaged: 8, expired: 5, warehouseStock: 1137 },
];

export const initialAccounts: AccountVoucher[] = [
  { id: 'VOU-501', date: '2026-06-28', type: 'Recovery', description: 'Recovery cash collection from Bismillah General Store (Zia OB)', debit: 12500, credit: 0 },
  { id: 'VOU-502', date: '2026-06-28', type: 'Cash Book', description: 'Received recovered amount to main cash safe', debit: 12500, credit: 0 },
  { id: 'VOU-503', date: '2026-06-29', type: 'Expenses', description: 'Order booker daily fuel allowance reimbursement', debit: 0, credit: 3200 },
  { id: 'VOU-504', date: '2026-06-29', type: 'Bank Book', description: 'Cheque cleared from Allied Bank - Cosmetics Sales deposit', debit: 64000, credit: 0 },
];

export const initialPayroll: PayrollRecord[] = [
  { id: 'PAY-1', userId: 'OB-0001', baseSalary: 25000, fuelAllowance: 4500, mobileAllowance: 1500, incentives: 8500, deductions: 500, netSalary: 39000, status: 'Paid' },
  { id: 'PAY-2', userId: 'OB-0002', baseSalary: 25000, fuelAllowance: 4000, mobileAllowance: 1500, incentives: 6200, deductions: 0, netSalary: 36700, status: 'Paid' },
  { id: 'PAY-3', userId: 'SM-0001', baseSalary: 22000, fuelAllowance: 8500, mobileAllowance: 1000, incentives: 4500, deductions: 1200, netSalary: 34800, status: 'Pending' },
  { id: 'PAY-4', userId: 'AC-0001', baseSalary: 45000, fuelAllowance: 2000, mobileAllowance: 2000, incentives: 0, deductions: 0, netSalary: 49000, status: 'Paid' },
];

export const initialGpsLogs: GpsLog[] = [
  { id: 'G-1', employeeId: 'OB-0001', employeeName: 'Zia-ur-Rehman', role: 'Order Booker', latitude: 33.6425, longitude: 73.0784, currentShop: 'Bismillah General Store', visitDuration: '14 mins', routeProgress: 80, lastUpdated: '12 seconds ago' },
  { id: 'G-2', employeeId: 'OB-0002', employeeName: 'Imran Khan', role: 'Order Booker', latitude: 33.5982, longitude: 73.0561, currentShop: 'Kashif Super Mart', visitDuration: '5 mins', routeProgress: 40, lastUpdated: '1 min ago' },
  { id: 'G-3', employeeId: 'SM-0001', employeeName: 'Sajid Mehmood', role: 'Supply Man', latitude: 33.6394, longitude: 73.0745, currentShop: 'Al-Madina Cosmetics', visitDuration: '35 mins (Delivering)', routeProgress: 60, lastUpdated: '30 seconds ago' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-991', timestamp: '2026-06-29 22:05:12', user: 'Muddasir Farid (MG-0001)', action: 'User OB-0002 assignment route updated to R-2', module: 'Central Users', ipAddress: '192.168.1.45' },
  { id: 'LOG-992', timestamp: '2026-06-29 21:10:45', user: 'Muddasir Farid (MG-0001)', action: 'Generated Monthly License LIC-SNAK_7711X for Farid Snacks', module: 'Licenses', ipAddress: '192.168.1.45' },
  { id: 'LOG-993', timestamp: '2026-06-29 18:40:02', user: 'Farhan Ahmed (AC-0001)', action: 'Approved Order ORD-1002 from Zia-ur-Rehman', module: 'Order Control', ipAddress: '192.168.1.12' },
  { id: 'LOG-994', timestamp: '2026-06-29 17:15:30', user: 'Muddasir Farid (MG-0001)', action: 'Suspended Operations User (OP-0001)', module: 'Security', ipAddress: '192.168.1.45' },
];
