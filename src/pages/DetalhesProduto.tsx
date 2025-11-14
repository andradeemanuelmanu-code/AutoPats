import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import NotFound from "./NotFound";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductHistoryTable } from "@/components/estoque/ProductHistoryTable";

const DetalhesProduto = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, salesOrders, purchaseOrders } = useAppData();

  const product = products.find(p => p.id === productId);

  const movements = useMemo(() => {
    if (!product) return [];

    const purchaseMovements = purchaseOrders
      .filter(order => order.status === 'Recebido')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Entrada' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'purchase' as const,
            quantity: item.quantity,
          }))
      );

    const salesMovements = salesOrders
      .filter(order => order.status === 'Faturado')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Saída' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'sales' as const,
            quantity: -item.quantity,
          }))
      );

    const allMovements = [...purchaseMovements, ...salesMovements].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const totalMovementQuantity = allMovements.reduce((acc, mov) => acc + mov.quantity, 0);
    const initialStock = product.stock - totalMovementQuantity;

    let balance = initialStock;
    return allMovements.map(mov => {
      balance += mov.quantity;
      return { ...mov, balance };
    });
  }, [product, salesOrders, purchaseOrders]);

  if (!product) {
    return <NotFound />;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link to="/estoque">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold md:text-2xl text-foreground">Detalhes do Produto</h1>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
            <CardDescription>Código: {product.code}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
            <div><span className="font-semibold text-muted-foreground">Categoria:</span> {product.category}</div>
            <div><span className="font-semibold text-muted-foreground">Marca:</span> {product.brand}</div>
            <div><span className="font-semibold text-muted-foreground">Estoque Atual:</span> {product.stock}</div>
            <div><span className="font-semibold text-muted-foreground">Estoque Mínimo:</span> {product.minStock}</div>
            <div><span className="font-semibold text-muted-foreground">Estoque Máximo:</span> {product.maxStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentação</CardTitle>
            <CardDescription>Entradas e saídas do estoque.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductHistoryTable movements={movements} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DetalhesProduto;