import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { mockProducts } from "@/data/products";
import { DashboardCard } from "./DashboardCard";
import { Button } from "@/components/ui/button";

export const StockAlertsCard = () => {
  const lowStockCount = useMemo(() => {
    return mockProducts.filter(p => p.stock <= p.minStock).length;
  }, []);

  return (
    <DashboardCard title="Alertas de Estoque" Icon={AlertTriangle} linkTo="/estoque">
      <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
      <p className="text-xs text-muted-foreground">
        Produtos abaixo do estoque mínimo
      </p>
    </DashboardCard>
  );
};