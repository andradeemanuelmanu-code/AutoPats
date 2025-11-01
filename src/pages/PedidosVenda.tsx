import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { SalesOrderTable } from "@/components/vendas/SalesOrderTable";
import { useAppData } from "@/context/AppDataContext";

const PedidosVenda = () => {
  const { salesOrders } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return salesOrders;
    const lowercasedTerm = searchTerm.toLowerCase();
    return salesOrders.filter(order =>
      order.number.toLowerCase().includes(lowercasedTerm) ||
      order.customerName.toLowerCase().includes(lowercasedTerm)
    );
  }, [salesOrders, searchTerm]);

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
          <Button asChild>
            <Link to="/vendas/pedidos/novo">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Pedido
            </Link>
          </Button>
        </div>
      </div>
      <SalesOrderTable orders={filteredOrders} />
    </>
  );
};

export default PedidosVenda;