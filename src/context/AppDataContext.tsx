import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { mockProducts, Product } from '@/data/products';
import { mockSalesOrders, SalesOrder } from '@/data/salesOrders';
import { mockCustomers, Customer } from '@/data/customers';
import { mockSuppliers, Supplier } from '@/data/suppliers';
import { mockPurchaseOrders, PurchaseOrder } from '@/data/purchaseOrders';

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: Date;
  linkTo?: string;
};

export interface AppDataContextType {
  products: Product[];
  salesOrders: SalesOrder[];
  customers: Customer[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  notifications: Notification[];
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'number'>) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'number'>) => void;
  cancelSalesOrder: (orderId: string) => void;
  cancelPurchaseOrder: (orderId: string) => void;
  updateSalesOrderStatus: (orderId: string, newStatus: SalesOrder['status']) => void;
  updatePurchaseOrderStatus: (orderId: string, newStatus: PurchaseOrder['status']) => void;
  markNotificationsAsRead: () => void;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, linkTo?: string) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      message,
      read: false,
      createdAt: new Date(),
      linkTo,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addSalesOrder = useCallback((orderData: Omit<SalesOrder, 'id' | 'number'>) => {
    setSalesOrders(prevOrders => {
      const newOrderNumber = `PV-2024-${(prevOrders.length + 1).toString().padStart(3, '0')}`;
      const newOrder: SalesOrder = { id: `so_${Date.now()}`, number: newOrderNumber, ...orderData };

      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts];
        newOrder.items.forEach(item => {
          const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
          if (productIndex !== -1) {
            const product = updatedProducts[productIndex];
            const oldStock = product.stock;
            const newStock = oldStock - item.quantity;
            updatedProducts[productIndex].stock = newStock;

            if (newStock <= product.minStock && oldStock > product.minStock) {
              addNotification(`Estoque baixo: ${product.description}`, '/estoque');
            }
          }
        });
        return updatedProducts;
      });
      
      return [newOrder, ...prevOrders];
    });
  }, [addNotification]);

  const addPurchaseOrder = useCallback((orderData: Omit<PurchaseOrder, 'id' | 'number'>) => {
    setPurchaseOrders(prevOrders => {
      const newOrderNumber = `PC-2024-${(prevOrders.length + 1).toString().padStart(3, '0')}`;
      const newOrder: PurchaseOrder = { id: `po_${Date.now()}`, number: newOrderNumber, ...orderData };

      if (newOrder.status === 'Recebido') {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          newOrder.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) {
              updatedProducts[productIndex].stock += item.quantity;
            }
          });
          return updatedProducts;
        });
      }
      return [newOrder, ...prevOrders];
    });
  }, []);

  const updateSalesOrderStatus = useCallback((orderId: string, newStatus: SalesOrder['status']) => {
    setSalesOrders(prevOrders => {
      const order = prevOrders.find(o => o.id === orderId);
      if (!order || order.status === newStatus) return prevOrders;

      const oldStatus = order.status;

      if (oldStatus !== 'Faturado' && newStatus === 'Faturado') {
        setProducts(prev => prev.map(p => {
          const item = order.items.find(i => i.productId === p.id);
          return item ? { ...p, stock: p.stock - item.quantity } : p;
        }));
      } else if (oldStatus === 'Faturado' && newStatus !== 'Faturado') {
        setProducts(prev => prev.map(p => {
          const item = order.items.find(i => i.productId === p.id);
          return item ? { ...p, stock: p.stock + item.quantity } : p;
        }));
      }

      addNotification(`Status do pedido ${order.number} atualizado para ${newStatus}.`, `/vendas/pedidos/${orderId}`);
      return prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    });
  }, [addNotification]);

  const updatePurchaseOrderStatus = useCallback((orderId: string, newStatus: PurchaseOrder['status']) => {
    setPurchaseOrders(prevOrders => {
      const order = prevOrders.find(o => o.id === orderId);
      if (!order || order.status === newStatus) return prevOrders;

      const oldStatus = order.status;

      if (oldStatus !== 'Recebido' && newStatus === 'Recebido') {
        setProducts(prev => prev.map(p => {
          const item = order.items.find(i => i.productId === p.id);
          return item ? { ...p, stock: p.stock + item.quantity } : p;
        }));
      } else if (oldStatus === 'Recebido' && newStatus !== 'Recebido') {
        setProducts(prev => prev.map(p => {
          const item = order.items.find(i => i.productId === p.id);
          return item ? { ...p, stock: p.stock - item.quantity } : p;
        }));
      }

      addNotification(`Status do pedido ${order.number} atualizado para ${newStatus}.`, `/compras/pedidos/${orderId}`);
      return prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    });
  }, [addNotification]);

  const cancelSalesOrder = useCallback((orderId: string) => updateSalesOrderStatus(orderId, 'Cancelado'), [updateSalesOrderStatus]);
  const cancelPurchaseOrder = useCallback((orderId: string) => updatePurchaseOrderStatus(orderId, 'Cancelado'), [updatePurchaseOrderStatus]);

  const value = useMemo(() => ({
    products,
    salesOrders,
    customers,
    suppliers,
    purchaseOrders,
    notifications,
    addSalesOrder,
    addPurchaseOrder,
    cancelSalesOrder,
    cancelPurchaseOrder,
    updateSalesOrderStatus,
    updatePurchaseOrderStatus,
    markNotificationsAsRead,
  }), [
    products, salesOrders, customers, suppliers, purchaseOrders, notifications,
    addSalesOrder, addPurchaseOrder, cancelSalesOrder, cancelPurchaseOrder,
    updateSalesOrderStatus, updatePurchaseOrderStatus, markNotificationsAsRead
  ]);

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