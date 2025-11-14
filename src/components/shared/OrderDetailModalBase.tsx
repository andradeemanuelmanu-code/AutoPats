import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatusDialog } from "@/components/OrderStatusDialog";
import { showSuccess } from "@/utils/toast";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderDetailModalBaseProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  orderNumber: string;
  orderDate: string;
  supplierName?: string;
  customerName?: string;
  status: string;
  statusStyles: Record<string, string>;
  items: OrderItem[];
  totalValue: number;
  availableStatuses: string[];
  onStatusChange: (newStatus: string) => void;
  children?: React.ReactNode;
}

export const OrderDetailModalBase = ({
  isOpen,
  onOpenChange,
  orderNumber,
  orderDate,
  supplierName,
  customerName,
  status,
  statusStyles,
  items,
  totalValue,
  availableStatuses,
  onStatusChange,
  children,
}: OrderDetailModalBaseProps) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleStatusSave = (newStatus: string) => {
    onStatusChange(newStatus);
    showSuccess("Status do pedido atualizado com sucesso!");
    setIsStatusModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-w-[95vw] h-[80vh] sm:h-[85vh] overflow-y-auto p-2 sm:p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">Detalhes do Pedido</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Pedido #{orderNumber}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="sm:col-span-3 lg:col-span-3 p-2 sm:p-3 md:p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
                <div>
                  <CardTitle className="text-base sm:text-lg">Informações Gerais</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {supplierName ? `Fornecedor: ${supplierName}` : `Cliente: ${customerName}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-muted-foreground">Data do Pedido</p>
                  <p className="text-xs sm:text-sm">{new Date(orderDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium">Status:</span>
                  <Badge className={cn("text-white text-xs sm:text-sm", statusStyles[status])}>{status}</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
                    onClick={() => setIsStatusModalOpen(true)}
                  >
                    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-3 lg:col-span-3 p-2 sm:p-3 md:p-4">
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

            <Card className="sm:col-span-2 lg:col-span-2 p-2 sm:p-3 md:p-4">
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
          </div>
          {children}
        </DialogContent>
      </Dialog>
      
      <OrderStatusDialog
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        currentStatus={status}
        availableStatuses={availableStatuses}
        onSave={handleStatusSave}
        orderNumber={orderNumber}
      />
    </>
  );
};