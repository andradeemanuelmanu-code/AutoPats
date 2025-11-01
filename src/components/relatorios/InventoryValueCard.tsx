import { useMemo } from "react";
import { Archive } from "lucide-react";
import { mockProducts } from "@/data/products";
import { ReportCard } from "./ReportCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InventoryValueCard = () => {
  const totalValue = useMemo(() => {
    return mockProducts.reduce((acc, product) => acc + (product.stock * product.costPrice), 0);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Valor do Inventário (Custo)
        </CardTitle>
        <Archive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <p className="text-xs text-muted-foreground">
          Valor total de todos os produtos em estoque.
        </p>
      </CardContent>
    </Card>
  );
};