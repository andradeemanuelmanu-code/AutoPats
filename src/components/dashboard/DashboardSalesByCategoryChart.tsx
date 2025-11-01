import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';
import { mockProducts } from '@/data/products';
import { useMemo } from 'react';

export const DashboardSalesByCategoryChart = () => {
  const chartData = useMemo(() => {
    const salesByCategory: { [key: string]: number } = {};
    mockSalesOrders.filter(o => o.status === 'Faturado').forEach(order => {
      order.items.forEach(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        if (product) {
          const category = product.category;
          salesByCategory[category] = (salesByCategory[category] || 0) + (item.quantity * item.unitPrice);
        }
      });
    });
    return Object.keys(salesByCategory).map(category => ({ name: category, Vendas: salesByCategory[category] }));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
        <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        <Bar dataKey="Vendas" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  );
};