import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { mockSalesOrders, SalesOrder } from "@/data/salesOrders";
import { SalesOrderTable } from "@/components/vendas/SalesOrderTable";

const PedidosVenda = () => {
  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const lowercasedTerm = searchTerm.toLowerCase();
    return orders.filter(order =>
      order.number.toLowerCase().includes(lowercasedTerm) ||
      order.customerName.toLowerCase().includes(lowercasedTerm)
    );
  }, [orders, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Pedidos de Venda</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>
      <SalesOrderTable orders={filteredOrders} />
    </>
  );
};

export default PedidosVenda;