import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderItemsTableProps {
  items: OrderItem[];
}

export const OrderItemsTable = ({ items }: OrderItemsTableProps) => {
  return (
    <Card className="p-2 sm:p-3 md:p-4">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Itens do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-4">
        <div className="overflow-x-auto -mx-1 sm:-mx-2 px-1 sm:px-2">
          <Table className="min-w-[300px] sm:min-w-[400px] md:min-w-[500px] text-xs sm:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Qtd.</TableHead>
                <TableHead className="text-right">Unit.</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xs sm:text-sm">{item.productName}</TableCell>
                  <TableCell className="text-center text-xs sm:text-sm">{item.quantity}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">
                    {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">
                    {item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};