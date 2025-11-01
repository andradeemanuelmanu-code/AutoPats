import { useNavigate } from "react-router-dom";
import { SalesOrderForm } from "@/components/vendas/SalesOrderForm";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";
import { SalesOrder } from "@/data/salesOrders";

const NovoPedidoVenda = () => {
  const navigate = useNavigate();
  const { customers, products, addSalesOrder } = useAppData();

  const handleSubmit = (data: any) => {
    const customer = customers.find(c => c.id === data.customerId);
    if (!customer) return;

    const totalValue = data.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);

    const newOrder: Omit<SalesOrder, 'id' | 'number'> = {
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toISOString().split('T')[0],
      status: "Pendente",
      totalValue,
      items: data.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    addSalesOrder(newOrder);
    showSuccess("Pedido de venda criado com sucesso!");
    navigate("/vendas/pedidos");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Novo Pedido de Venda</h1>
      </div>
      <SalesOrderForm
        customers={customers}
        products={products}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/vendas/pedidos")}
      />
    </>
  );
};

export default NovoPedidoVenda;