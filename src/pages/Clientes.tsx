import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockCustomers, Customer } from "@/data/customers";
import { CustomerCard } from "@/components/vendas/CustomerCard";
import { CustomerForm } from "@/components/vendas/CustomerForm";
import { showSuccess, showError } from "@/utils/toast";

const Clientes = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleOpenModal = (customer: Customer | null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = (data: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...data } : c));
      showSuccess("Cliente atualizado!");
    } else {
      const newCustomer: Customer = { id: `cust_${Date.now()}`, ...data };
      setCustomers([newCustomer, ...customers]);
      showSuccess("Cliente cadastrado!");
    }
    handleCloseModal();
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Tem certeza?")) {
      setCustomers(customers.filter(c => c.id !== customerId));
      showError("Cliente excluído.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Clientes</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar clientes..." className="pl-8 sm:w-[300px]" />
          </div>
          <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map(customer => (
          <CustomerCard key={customer.id} customer={customer} onEdit={handleOpenModal} onDelete={handleDeleteCustomer} />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <CustomerForm customer={editingCustomer} onSubmit={handleSaveCustomer} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Clientes;