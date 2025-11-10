import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, History } from "lucide-react";
import { Product } from "@/data/products";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onViewHistory: (productId: string) => void;
}

export const ProductTable = ({ products, onEdit, onDelete, onViewHistory }: ProductTableProps) => {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead className="text-center">Estoque Atual</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {products.map((product) => (
            <TableRow key={product.id} className="block md:table-row mb-4 md:mb-0 border md:border-0 rounded-lg shadow-md md:shadow-none">
              <TableCell data-label="Código:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none font-medium">{product.code}</TableCell>
              <TableCell data-label="Descrição:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{product.description}</TableCell>
              <TableCell data-label="Categoria:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{product.category}</TableCell>
              <TableCell data-label="Marca:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{product.brand}</TableCell>
              <TableCell data-label="Estoque:" className="block md:table-cell text-right md:text-center p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                {product.stock <= product.minStock ? (
                  <Badge variant="destructive">{product.stock}</Badge>
                ) : (
                  product.stock
                )}
              </TableCell>
              <TableCell className="block md:table-cell text-right md:text-center p-2 md:p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewHistory(product.id)}>
                      <History className="mr-2 h-4 w-4" /> Histórico
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => onDelete(product.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
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