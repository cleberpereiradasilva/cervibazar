"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ShoppingCart as ShoppingCartIcon,
  History,
  Lock,
  LockOpen,
  LogOut,
  Menu,
  NotebookPen,
  PanelLeft,
  UserCog,
  UserRound,
  Users,
  WalletMinimal,
  Tags as TagsIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Sheet } from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { Toaster } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileForm from "./profile/ProfileForm";

type SidebarLayoutProps = {
  readonly children: React.ReactNode;
};

type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly active?: boolean;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: currentUser } = useCurrentUser();
  const mainNavigation: NavItem[] = [
    { label: "Vendas", icon: ShoppingCartIcon, href: "/vendas" },
    { label: "Histórico", icon: History, href: "/historico" },
    { label: "Sangria de Caixa", icon: WalletMinimal, href: "/sangrias" },
  ];

  const adminNavigation: NavItem[] = [
    { label: "Abertura de Caixa", icon: LockOpen, href: "/abertura" },
    { label: "Fechamento de Caixa", icon: Lock, href: "/fechamento" },
    { label: "Relatórios de Vendas", icon: BarChart3, href: "/relatorios" },
    { label: "Clientes", icon: Users, href: "/clientes" },
    { label: "Gerenciamento de Usuários", icon: UserCog, href: "/usuarios" },
    { label: "Motivos de Sangria", icon: NotebookPen, href: "/motivos" },
    { label: "Categorias", icon: TagsIcon, href: "/categorias" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    const common = `path=/; max-age=0; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`;
    document.cookie = `auth_token=; ${common}`;
    document.cookie = `user_name=; ${common}`;
    document.cookie = `user_role=; ${common}`;
    document.cookie = `user_id=; ${common}`;
    document.cookie = `user_username=; ${common}`;
    router.push("/login");
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center justify-center border-b border-border bg-surface-light px-6 dark:border-[#452b4d] dark:bg-surface-dark">
        <img
          src="/logo-cervi.png"
          alt="Cervi Bazar"
          className={`${collapsed ? "h-12 w-12" : "h-auto w-[140px]"} object-contain`}
        />
      </div>
      <ScrollArea className="flex-1 px-2 py-5">
        <nav className="space-y-2">
          {mainNavigation.map((item) => {
            const isActive = item.href !== "#" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className={`group flex items-center gap-3 rounded-xl ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} text-text-secondary transition-all hover:bg-primary/5 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-[#bcaec4] dark:hover:bg-[#452b4d] dark:hover:text-white ${
                  isActive ? "bg-primary/10 text-primary shadow-sm dark:text-white" : ""
                }`}
              >
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="space-y-2">
          {!collapsed && (
            <p className="px-4 text-xs font-bold uppercase tracking-widest text-text-secondary/60">
              Administração
            </p>
          )}
          {adminNavigation.map((item) => {
            const isActive = item.href !== "#" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className={`group flex items-center gap-3 rounded-xl ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"} text-text-secondary transition-all hover:bg-primary/5 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-[#bcaec4] dark:hover:bg-[#452b4d] dark:hover:text-white ${
                  isActive ? "bg-primary/10 text-primary shadow-sm dark:text-white" : ""
                }`}
              >
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4 dark:border-[#452b4d]">
        <Button
          variant="outline"
          className={`w-full justify-center gap-2 border border-[#e6e1e8] text-text-secondary hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-[#452b4d] dark:hover:bg-red-900/20 dark:hover:text-red-400 ${collapsed ? "px-2" : ""}`}
          tabIndex={0}
          aria-label="Sair do Sistema"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && "Sair do Sistema"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light text-text-main dark:bg-background-dark dark:text-white lg:flex lg:gap-0">
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-surface-light transition-all duration-200 dark:border-[#452b4d] dark:bg-surface-dark lg:flex ${
          collapsed ? "w-20" : "w-72"
        }`}
        aria-hidden={false}
      >
        {SidebarContent}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} title="Menu">
        {SidebarContent}
      </Sheet>

      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-200 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e6e1e8] bg-surface-light/80 px-6 backdrop-blur-md dark:border-[#452b4d] dark:bg-surface-dark/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg p-2 text-text-secondary hover:bg-background-light dark:hover:bg-[#452b4d] lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
                tabIndex={0}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden rounded-lg p-2 text-text-secondary hover:bg-background-light dark:hover:bg-[#452b4d] lg:inline-flex"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                tabIndex={0}
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="mr-2 hidden flex-col items-end sm:flex">
              <span className="text-sm font-bold text-text-main dark:text-white">
                {currentUser?.name || "Usuário"}
              </span>
              <Badge variant="accent" aria-label="Cargo do usuário">
                {currentUser?.role === "admin"
                  ? "Administrador"
                  : currentUser?.role === "caixa"
                  ? "Caixa"
                  : "—"}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                  aria-label="Abrir menu do usuário"
                  tabIndex={0}
                >
                  {currentUser?.name ? (
                    <span className="text-sm font-bold">
                      {currentUser.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("")}
                    </span>
                  ) : (
                    <UserRound className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{currentUser?.name || "Usuário"}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="gap-2">
                  <UserRound className="h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-8">
          {children}
        </main>
      </div>

      <Sheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        title="Editar Perfil"
        className="w-full max-w-xl"
      >
        <div className="p-6">
          <ProfileForm onClose={() => setProfileOpen(false)} />
        </div>
      </Sheet>

      <Toaster position="top-right" richColors duration={2000} />
    </div>
  );
}
