import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { ProductTable } from "@/components/estoque/ProductTable";
import { ProductForm } from "@/components/estoque/ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/data/products";
import { showSuccess, showError } from "@/utils/toast";
import { useAppData } from "@/context/AppDataContext";
import { ProductHistoryModal } from "@/components/estoque/ProductHistoryModal";

const Estoque = () => {
  const { products: globalProducts, salesOrders, purchaseOrders } = useAppData();
  const [products, setProducts] = useState<Product[]>(globalProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productMovements, setProductMovements] = useState<any[]>([]);

  const categories = useMemo(() => {
    const categorySet = new Set(globalProducts.map(p => p.category));
    return Array.from(categorySet).sort();
  }, [globalProducts]);

  const brands = useMemo(() => {
    const brandSet = new Set(globalProducts.map(p => p.brand));
    return Array.from(brandSet).sort();
  }, [globalProducts]);

  const filteredProducts = useMemo(() => {
    const sourceProducts = products.map(p => {
      const globalProduct = globalProducts.find(gp => gp.id === p.id);
      return globalProduct ? { ...p, stock: globalProduct.stock } : p;
    });

    if (!searchTerm) return sourceProducts;
    const lowercasedTerm = searchTerm.toLowerCase();
    return sourceProducts.filter(product =>
      product.code.toLowerCase().includes(lowercasedTerm) ||
      product.description.toLowerCase().includes(lowercasedTerm) ||
      product.category.toLowerCase().includes(lowercasedTerm) ||
      product.brand.toLowerCase().includes(lowercasedTerm)
    );
  }, [products, globalProducts, searchTerm]);

  const handleOpenModal = (product: Product | null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (data: Omit<Product, 'id' | 'stock'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...data } : p));
      showSuccess("Produto atualizado com sucesso!");
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        stock: 0,
        ...data,
      };
      setProducts([newProduct, ...products]);
      showSuccess("Produto cadastrado com sucesso!");
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter(p => p.id !== productId));
      showError("Produto excluído.");
    }
  };

  const handleViewHistory = (productId: string) => {
    const product = globalProducts.find(p => p.id === productId);
    if (!product) return;

    const purchaseMovements = purchaseOrders
      .filter(order => order.status === 'Recebido')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Entrada' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'purchase' as const,
            quantity: item.quantity,
          }))
      );

    const salesMovements = salesOrders
      .filter(order => order.status === 'Faturado')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Saída' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'sales' as const,
            quantity: -item.quantity,
          }))
      );

    const allMovements = [...purchaseMovements, ...salesMovements].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const totalMovementQuantity = allMovements.reduce((acc, mov) => acc + mov.quantity, 0);
    const initialStock = product.stock - totalMovementQuantity;

    let balance = initialStock;
    const movementsWithBalance = allMovements.map(mov => {
      balance += mov.quantity;
      return { ...mov, balance };
    });

    setSelectedProduct(product);
    setProductMovements(movementsWithBalance);
    setIsHistoryModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Estoque de Produtos</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8 w-full sm:w-auto md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenModal(null)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <ProductTable 
        products={filteredProducts} 
        onEdit={(p) => handleOpenModal(p)} 
        onDelete={handleDeleteProduct}
        onViewHistory={handleViewHistory}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleSaveProduct}
            onCancel={handleCloseModal}
            categories={categories}
            brands={brands}
          />
        </DialogContent>
      </Dialog>

      <ProductHistoryModal
        isOpen={isHistoryModalOpen}
        onOpenChange={setIsHistoryModalOpen}
        product={selectedProduct}
        movements={productMovements}
      />
    </>
  );
};

export default Estoque;