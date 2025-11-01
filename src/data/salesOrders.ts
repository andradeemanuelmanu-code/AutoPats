import { mockCustomers } from './customers';

export type SalesOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type SalesOrder = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  totalValue: number;
  status: "Pendente" | "Faturado" | "Cancelado";
  items: SalesOrderItem[];
};

export const mockSalesOrders: SalesOrder[] = [
  { id: 'so_001', number: 'PV-2024-001', customerId: 'cust_001', customerName: mockCustomers[0].name, date: '2024-07-28', totalValue: 750.80, status: 'Faturado', items: [] },
  { id: 'so_002', number: 'PV-2024-002', customerId: 'cust_002', customerName: mockCustomers[1].name, date: '2024-07-29', totalValue: 1200.00, status: 'Pendente', items: [] },
  { id: 'so_003', number: 'PV-2024-003', customerId: 'cust_003', customerName: mockCustomers[2].name, date: '2024-07-30', totalValue: 315.50, status: 'Cancelado', items: [] },
];