import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const IAInsights = () => {
  // Toda a lógica de estado e funções foi removida para depuração.
  // O objetivo é ver se uma versão mínima do componente compila.

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold md:text-2xl text-foreground">IA Insights</h1>
        </div>
      </div>
      <div className="grid gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Teste de Compilação</CardTitle>
            <CardDescription>Este é um teste para ver se o componente renderiza.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Se você está vendo isso, a compilação funcionou.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IAInsights;