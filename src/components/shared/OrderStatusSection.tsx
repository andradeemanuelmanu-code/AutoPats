import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusSectionProps {
  orderNumber: string;
  orderDate: string;
  supplierName?: string;
  customerName?: string;
  status: string;
  statusStyles: Record<string, string>;
  onEditStatus: () => void;
}

export const OrderStatusSection = ({
  orderNumber,
  orderDate,
  supplierName,
  customerName,
  status,
  statusStyles,
  onEditStatus,
}: OrderStatusSectionProps) => {
  return (
    <Card className="p-2 sm:p-3 md:p-4">
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
            onClick={onEditStatus}
          >
            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};