import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
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

  const addNotification = (message: string, linkTo?: string) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      message,
      read: false,
      createdAt: new Date(),
      linkTo,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addSalesOrder = (orderData: Omit<SalesOrder, 'id' | 'number'>) => {
    const newOrderNumber = `PV-2024-${(salesOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: SalesOrder = { id: `so_${Date.now()}`, number: newOrderNumber, ...orderData };
    setSalesOrders(prevOrders => [newOrder, ...prevOrders]);

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
  };

  const addPurchaseOrder = (orderData: Omit<PurchaseOrder, 'id' | 'number'>) => {
    const newOrderNumber = `PC-2024-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: PurchaseOrder = { id: `po_${Date.now()}`, number: newOrderNumber, ...orderData };
    setPurchaseOrders(prevOrders => [newOrder, ...prevOrders]);

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
  };

  const updateSalesOrderStatus = (orderId: string, newStatus: SalesOrder['status']) => {
    const order = salesOrders.find(o => o.id === orderId);
    if (!order || order.status === newStatus) return;

    const oldStatus = order.status;

    // Adjust stock
    if (oldStatus !== 'Faturado' && newStatus === 'Faturado') {
      // Pendente/Cancelado -> Faturado: Decrease stock
      order.items.forEach(item => {
        setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: p.stock - item.quantity } : p));
      });
    } else if (oldStatus === 'Faturado' && newStatus !== 'Faturado') {
      // Faturado -> Pendente/Cancelado: Increase stock
      order.items.forEach(item => {
        setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: p.stock + item.quantity } : p));
      });
    }

    // Update order status
    setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addNotification(`Status do pedido ${order.number} atualizado para ${newStatus}.`, `/vendas/pedidos/${orderId}`);
  };

  const updatePurchaseOrderStatus = (orderId: string, newStatus: PurchaseOrder['status']) => {
    const order = purchaseOrders.find(o => o.id === orderId);
    if (!order || order.status === newStatus) return;

    const oldStatus = order.status;

    // Adjust stock
    if (oldStatus !== 'Recebido' && newStatus === 'Recebido') {
      // Pendente/Cancelado -> Recebido: Increase stock
      order.items.forEach(item => {
        setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: p.stock + item.quantity } : p));
      });
    } else if (oldStatus === 'Recebido' && newStatus !== 'Recebido') {
      // Recebido -> Pendente/Cancelado: Decrease stock
      order.items.forEach(item => {
        setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: p.stock - item.quantity } : p));
      });
    }

    // Update order status
    setPurchaseOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addNotification(`Status do pedido ${order.number} atualizado para ${newStatus}.`, `/compras/pedidos/${orderId}`);
  };

  const cancelSalesOrder = (orderId: string) => updateSalesOrderStatus(orderId, 'Cancelado');
  const cancelPurchaseOrder = (orderId: string) => updatePurchaseOrderStatus(orderId, 'Cancelado');

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
  }), [products, salesOrders, customers, suppliers, purchaseOrders, notifications]);

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