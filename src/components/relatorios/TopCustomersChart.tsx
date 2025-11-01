import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';
import { useMemo } from 'react';

export const TopCustomersChart = () => {
  const chartData = useMemo(() => {
    const salesByCustomer: { [key: string]: number } = {};

    mockSalesOrders
      .filter(order => order.status === 'Faturado')
      .forEach(order => {
        if (!salesByCustomer[order.customerName]) {
          salesByCustomer[order.customerName] = 0;
        }
        salesByCustomer[order.customerName] += order.totalValue;
      });

    return Object.keys(salesByCustomer)
      .map(customerName => ({
        name: customerName,
        Faturamento: salesByCustomer[customerName],
      }))
      .sort((a, b) => b.Faturamento - a.Faturamento)
      .slice(0, 5);
  }, []);

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `R$${value / 1000}k`} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Bar dataKey="Faturamento" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};