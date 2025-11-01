import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useAppData } from "@/context/AppDataContext";

export const StockAlertsCard = () => {
  const { products } = useAppData();
  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock).length;
  }, [products]);

  return (
    <DashboardCard title="Alertas de Estoque" Icon={AlertTriangle} linkTo="/estoque">
      <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
      <p className="text-xs text-muted-foreground">
        Produtos abaixo do estoque mínimo
      </p>
    </DashboardCard>
  );
};