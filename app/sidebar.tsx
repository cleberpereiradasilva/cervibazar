import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CircleMinus,
  HandCoins,
  Lock,
  LockOpen,
  LogOut,
  Menu,
  NotebookPen,
  UserCog,
  UserRound,
} from "lucide-react";

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
  const mainNavigation: NavItem[] = [
    { label: "Frente de Caixa", icon: HandCoins, href: "#" },
    { label: "Abertura de Caixa", icon: LockOpen, href: "#", active: true },
    { label: "Fechamento de Caixa", icon: Lock, href: "#" },
    { label: "Sangria de Caixa", icon: CircleMinus, href: "#" },
  ];

  const adminNavigation: NavItem[] = [
    { label: "Relatórios de Vendas", icon: BarChart3, href: "#" },
    { label: "Gerenciamento de Usuários", icon: UserCog, href: "/usuarios" },
    { label: "Motivos de Sangria", icon: NotebookPen, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-background-light text-text-main dark:bg-background-dark dark:text-white lg:flex lg:gap-0">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-[#e6e1e8] bg-surface-light transition-transform dark:border-[#452b4d] dark:bg-surface-dark lg:flex">
        <div className="flex h-24 items-center justify-center border-b border-[#e6e1e8] p-6 dark:border-[#452b4d]">
          <span className="text-lg font-extrabold uppercase tracking-wider text-primary">
            Cervi Bazar
          </span>
        </div>
        <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {mainNavigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-text-secondary transition-all hover:bg-primary/5 hover:text-primary dark:text-[#bcaec4] dark:hover:bg-[#452b4d] dark:hover:text-white ${
                item.active
                  ? "bg-primary/10 text-primary shadow-sm dark:text-white"
                  : ""
              }`}
            >
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          ))}

          <div className="my-4 border-t border-[#e6e1e8] dark:border-[#452b4d]" />

          <p className="mb-2 px-4 text-xs font-bold uppercase tracking-widest text-text-secondary/60">
            Administração
          </p>

          {adminNavigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-text-secondary transition-all hover:bg-primary/5 hover:text-primary dark:text-[#bcaec4] dark:hover:bg-[#452b4d] dark:hover:text-white"
            >
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#e6e1e8] p-4 dark:border-[#452b4d]">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e6e1e8] px-4 py-3 text-sm font-bold text-text-secondary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-[#452b4d] dark:hover:bg-red-900/20 dark:hover:text-red-400">
            <LogOut className="h-5 w-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e6e1e8] bg-surface-light/80 px-6 backdrop-blur-md dark:border-[#452b4d] dark:bg-surface-dark/80">
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 text-text-secondary hover:bg-background-light dark:hover:bg-[#452b4d] lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-text-main md:text-2xl dark:text-white">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="mr-2 hidden flex-col items-end sm:flex">
              <span className="text-sm font-bold text-text-main dark:text-white">
                Admin User
              </span>
              <span className="text-xs text-text-secondary">Gerente</span>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              <UserRound className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
