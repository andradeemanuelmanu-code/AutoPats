import { KpiCard } from "@/components/dashboard/KpiCard";
import { DollarSign, Package, Users, Activity } from "lucide-react";

const Index = () => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <KpiCard
          title="Faturamento Total"
          value="R$ 45.231,89"
          change="+20.1% do último mês"
          changeType="positive"
          Icon={DollarSign}
        />
        <KpiCard
          title="Vendas"
          value="+12.234"
          change="+19% do último mês"
          changeType="positive"
          Icon={Users}
        />
        <KpiCard
          title="Novos Pedidos"
          value="+2.350"
          change="+180.1% do último mês"
          changeType="positive"
          Icon={Package}
        />
        <KpiCard
          title="Giro de Estoque"
          value="573"
          change="-2.4% da última hora"
          changeType="negative"
          Icon={Activity}
        />
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-card">
        <div className="flex flex-col items-center gap-1 text-center p-8">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Área para gráficos e relatórios
          </h3>
          <p className="text-sm text-muted-foreground">
            Componentes de visualização de dados serão adicionados aqui.
          </p>
        </div>
      </div>
    </>
  );
};

export default Index;