import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { mockSalesOrders, SalesOrder } from "@/data/salesOrders";
import { SalesOrderTable } from "@/components/vendas/SalesOrderTable";

const PedidosVenda = () => {
  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Pedidos de Venda</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar pedidos..." className="pl-8 sm:w-[300px]" />
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>
      <SalesOrderTable orders={orders} />
    </>
  );
};

export default PedidosVenda;