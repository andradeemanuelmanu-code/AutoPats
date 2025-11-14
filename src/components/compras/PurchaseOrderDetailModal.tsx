import { OrderDetailModalBase } from "@/components/shared/OrderDetailModalBase";
import { OrderStatusSection } from "@/components/shared/OrderStatusSection";
import { OrderItemsTable } from "@/components/shared/OrderItemsTable";
import { OrderSummarySection } from "@/components/shared/OrderSummarySection";
import { cn } from "@/lib/utils";
import { PurchaseOrder } from "@/data/purchaseOrders";
import { useAppData } from "@/context/AppDataContext";

interface PurchaseOrderDetailModalProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusStyles = {
  Pendente: "bg-orange-500",
  Recebido: "bg-green-500",
  Cancelado: "bg-red-500",
};

export const PurchaseOrderDetailModal = ({ order, isOpen, onOpenChange }: PurchaseOrderDetailModalProps) => {
  const { updatePurchaseOrderStatus } = useAppData();

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    updatePurchaseOrderStatus(order.id, newStatus as PurchaseOrder['status']);
  };

  const items = order.items.map(item => ({
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  }));

  return (
    <OrderDetailModalBase
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      orderNumber={order.number}
      orderDate={order.date}
      supplierName={order.supplierName}
      status={order.status}
      statusStyles={statusStyles}
      items={items}
      totalValue={order.totalValue}
      availableStatuses={["Pendente", "Recebido", "Cancelado"]}
      onStatusChange={handleStatusChange}
    >
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <OrderStatusSection
          orderNumber={order.number}
          orderDate={order.date}
          supplierName={order.supplierName}
          status={order.status}
          statusStyles={statusStyles}
          onEditStatus={() => {}}
        />
        <OrderItemsTable items={items} />
        <OrderSummarySection totalValue={order.totalValue} />
      </div>
    </OrderDetailModalBase>
  );
};