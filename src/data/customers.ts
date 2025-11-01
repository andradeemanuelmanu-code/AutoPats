export type Customer = {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  email: string;
  address: string;
};

export const mockCustomers: Customer[] = [
  { id: 'cust_001', name: 'Oficina Mecânica Veloz', cpfCnpj: '11.222.333/0001-44', phone: '(11) 91111-2222', email: 'compras@oficinaveloz.com', address: 'Rua da Aceleração, 100, São Paulo, SP' },
  { id: 'cust_002', name: 'Auto Center Confiança', cpfCnpj: '44.555.666/0001-77', phone: '(21) 93333-4444', email: 'contato@autocenterconfianca.com', address: 'Avenida da Segurança, 200, Rio de Janeiro, RJ' },
  { id: 'cust_003', name: 'João da Silva - MEI', cpfCnpj: '123.456.789-00', phone: '(31) 95555-6666', email: 'joao.silva@email.com', address: 'Rua do Parafuso, 300, Belo Horizonte, MG' },
];