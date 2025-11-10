import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { PurchaseOrder } from "@/data/purchaseOrders";
import { cn } from "@/lib/utils";

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  onViewDetails: (orderId: string) => void;
  onCancel: (orderId: string) => void;
}

const statusStyles = {
  Pendente: "bg-orange-500",
  Recebido: "bg-green-500",
  Cancelado: "bg-red-500",
};

export const PurchaseOrderTable = ({ orders, onViewDetails, onCancel }: PurchaseOrderTableProps) => {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {orders.map((order) => (
            <TableRow key={order.id} className="block md:table-row mb-4 md:mb-0 border md:border-0 rounded-lg shadow-md md:shadow-none">
              <TableCell data-label="Número:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none font-medium">{order.number}</TableCell>
              <TableCell data-label="Fornecedor:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{order.supplierName}</TableCell>
              <TableCell data-label="Data:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell data-label="Status:" className="block md:table-cell text-right md:text-center p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                <Badge className={cn("text-white", statusStyles[order.status])}>{order.status}</Badge>
              </TableCell>
              <TableCell data-label="Valor Total:" className="block md:table-cell text-right md:text-right p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="block md:table-cell text-right md:text-center p-2 md:p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(order.id)}><Eye className="mr-2 h-4 w-4" /> Detalhes</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-500" 
                      onClick={() => onCancel(order.id)}
                      disabled={order.status === 'Cancelado'}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};