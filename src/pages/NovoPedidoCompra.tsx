import { useNavigate } from "react-router-dom";
import { PurchaseOrderForm } from "@/components/compras/PurchaseOrderForm";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";
import { PurchaseOrder } from "@/data/purchaseOrders";

const NovoPedidoCompra = () => {
  const navigate = useNavigate();
  const { suppliers, products, addPurchaseOrder } = useAppData();

  const handleSubmit = (data: any) => {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) return;

    const totalValue = data.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);

    const newOrder: Omit<PurchaseOrder, 'id' | 'number'> = {
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: new Date().toISOString().split('T')[0],
      status: "Recebido", // Defaulting to 'Recebido' to trigger stock update
      totalValue,
      items: data.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    addPurchaseOrder(newOrder);
    showSuccess("Pedido de compra criado e estoque atualizado!");
    navigate("/compras/pedidos");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Novo Pedido de Compra</h1>
      </div>
      <PurchaseOrderForm
        suppliers={suppliers}
        products={products}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/compras/pedidos")}
      />
    </>
  );
};

export default NovoPedidoCompra;