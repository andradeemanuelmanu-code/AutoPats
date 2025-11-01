import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockProducts, Product } from '@/data/products';
import { mockSalesOrders, SalesOrder, SalesOrderItem } from '@/data/salesOrders';
import { mockCustomers, Customer } from '@/data/customers';
import { mockSuppliers, Supplier } from '@/data/suppliers';
import { mockPurchaseOrders, PurchaseOrder } from '@/data/purchaseOrders';

interface AppDataContextType {
  products: Product[];
  salesOrders: SalesOrder[];
  customers: Customer[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'number'>) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  const addSalesOrder = (orderData: Omit<SalesOrder, 'id' | 'number'>) => {
    const newOrderNumber = `PV-2024-${(salesOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: SalesOrder = {
      id: `so_${Date.now()}`,
      number: newOrderNumber,
      ...orderData,
    };

    setSalesOrders(prevOrders => [newOrder, ...prevOrders]);

    // Update stock
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      newOrder.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock -= item.quantity;
        }
      });
      return updatedProducts;
    });
  };

  const value = useMemo(() => ({
    products,
    salesOrders,
    customers,
    suppliers,
    purchaseOrders,
    addSalesOrder,
  }), [products, salesOrders, customers, suppliers, purchaseOrders]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};