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
import { mockProducts, Product } from "@/data/products";
import { showSuccess, showError } from "@/utils/toast";

const Estoque = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowercasedTerm = searchTerm.toLowerCase();
    return products.filter(product =>
      product.code.toLowerCase().includes(lowercasedTerm) ||
      product.description.toLowerCase().includes(lowercasedTerm) ||
      product.category.toLowerCase().includes(lowercasedTerm) ||
      product.brand.toLowerCase().includes(lowercasedTerm)
    );
  }, [products, searchTerm]);

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

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Estoque de Produtos</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <ProductTable products={filteredProducts} onEdit={(p) => handleOpenModal(p)} onDelete={handleDeleteProduct} />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleSaveProduct}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Estoque;