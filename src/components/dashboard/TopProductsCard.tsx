import { useMemo } from "react";
import { Star } from "lucide-react";
import { mockSalesOrders } from "@/data/salesOrders";
import { DashboardCard } from "./DashboardCard";

export const TopProductsCard = () => {
  const topProducts = useMemo(() => {
    const productSales: { [key: string]: { name: string; quantity: number } } = {};

    mockSalesOrders
      .filter(order => order.status === 'Faturado')
      .forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { name: item.productName, quantity: 0 };
          }
          productSales[item.productId].quantity += item.quantity;
        });
      });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, []);

  return (
    <DashboardCard title="Produtos Mais Vendidos" Icon={Star}>
      <ul className="space-y-1 text-sm">
        {topProducts.map((product, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="truncate text-muted-foreground">{product.name}</span>
            <span className="font-semibold">{product.quantity}</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};