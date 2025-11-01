export type Product = {
  id: string;
  code: string;
  description: string;
  category: string;
  brand: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
};

export const mockProducts: Product[] = [
  { id: 'prod_001', code: 'NGK-BKR6E', description: 'Vela de Ignição Laser Iridium', category: 'Ignição', brand: 'NGK', costPrice: 25.50, salePrice: 49.90, stock: 150, minStock: 50, maxStock: 300 },
  { id: 'prod_002', code: 'FR-7882', description: 'Filtro de Óleo do Motor', category: 'Filtros', brand: 'Fram', costPrice: 12.00, salePrice: 25.00, stock: 80, minStock: 30, maxStock: 200 },
  { id: 'prod_003', code: 'COF-GP30457', description: 'Amortecedor Dianteiro', category: 'Suspensão', brand: 'Cofap', costPrice: 180.00, salePrice: 350.00, stock: 45, minStock: 20, maxStock: 100 },
  { id: 'prod_004', code: 'BOS-0986', description: 'Pastilha de Freio Dianteira', category: 'Freios', brand: 'Bosch', costPrice: 65.00, salePrice: 129.90, stock: 15, minStock: 25, maxStock: 150 },
  { id: 'prod_005', code: 'VAL-507826', description: 'Kit de Embreagem', category: 'Transmissão', brand: 'Valeo', costPrice: 320.00, salePrice: 599.00, stock: 30, minStock: 10, maxStock: 50 },
  { id: 'prod_006', code: 'GAT-KS304', description: 'Correia Dentada', category: 'Motor', brand: 'Gates', costPrice: 45.00, salePrice: 95.00, stock: 120, minStock: 40, maxStock: 250 },
  { id: 'prod_007', code: 'MOU-M60AD', description: 'Bateria 60Ah', category: 'Elétrica', brand: 'Moura', costPrice: 280.00, salePrice: 450.00, stock: 60, minStock: 20, maxStock: 80 },
];