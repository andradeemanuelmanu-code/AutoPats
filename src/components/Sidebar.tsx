import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Map,
  BarChart3,
  Settings,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", Icon: Package },
  { to: "/vendas", label: "Vendas", Icon: ShoppingCart },
  { to: "/compras", label: "Compras", Icon: ClipboardList },
  { to: "/mapa", label: "Mapa Interativo", Icon: Map },
  { to: "/relatorios", label: "Relatórios", Icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", Icon: Settings },
];

const NavItem = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )
    }
  >
    <Icon className="h-4 w-4" />
    {label}
  </NavLink>
);

export const Sidebar = () => {
  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6 text-primary" />
            <span className="">Autoparts</span>
          </NavLink>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};