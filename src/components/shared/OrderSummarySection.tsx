import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummarySectionProps {
  totalValue: number;
}

export const OrderSummarySection = ({ totalValue }: OrderSummarySectionProps) => {
  return (
    <Card className="p-2 sm:p-3 md:p-4">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Resumo Financeiro</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-4 text-right">
        <p className="text-lg sm:text-xl font-bold">
          {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">Valor Total do Pedido</p>
      </CardContent>
    </Card>
  );
};