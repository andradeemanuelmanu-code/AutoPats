import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';
import { mockPurchaseOrders } from '@/data/purchaseOrders';
import { useMemo } from 'react';

export const StockMovementChart = () => {
  const chartData = useMemo(() => {
    const movements: { [date: string]: { entradas: number; saidas: number } } = {};

    mockPurchaseOrders.filter(o => o.status === 'Recebido').forEach(order => {
      const date = new Date(order.date).toLocaleDateString('pt-BR');
      if (!movements[date]) movements[date] = { entradas: 0, saidas: 0 };
      movements[date].entradas += order.items.reduce((acc, item) => acc + item.quantity, 0);
    });

    mockSalesOrders.filter(o => o.status === 'Faturado').forEach(order => {
      const date = new Date(order.date).toLocaleDateString('pt-BR');
      if (!movements[date]) movements[date] = { entradas: 0, saidas: 0 };
      movements[date].saidas += order.items.reduce((acc, item) => acc + item.quantity, 0);
    });

    return Object.keys(movements).map(date => ({
      date,
      Entradas: movements[date].entradas,
      Saídas: movements[date].saidas,
    })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Entradas" stroke="#22c55e" />
        <Line type="monotone" dataKey="Saídas" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
};