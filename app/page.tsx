import { ChartNoAxesCombined, LayoutDashboard } from "lucide-react";
import SidebarLayout from "./sidebar";

export default function Home() {
  return (
    <SidebarLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border-2 border-dashed border-[#e6e1e8] bg-surface-light/30 p-8 text-center shadow-sm dark:border-[#452b4d] dark:bg-surface-dark/30">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-background-light shadow-inner dark:bg-[#382240]">
              <LayoutDashboard className="h-10 w-10 text-text-secondary/40 dark:text-[#bcaec4]/40" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-text-secondary dark:text-[#bcaec4]">
            Área de Trabalho
          </h2>
          <p className="mx-auto max-w-md text-sm text-text-secondary/80 dark:text-[#bcaec4]/70">
            Selecione uma opção no menu lateral para começar a gerenciar o
            sistema. Esta área exibirá os detalhes da funcionalidade escolhida.
          </p>
        </section>

        <section className="rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm transition hover:shadow-md dark:border-[#452b4d] dark:bg-surface-dark">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/70">
                Status rápido
              </p>
              <h3 className="text-lg font-bold text-text-main dark:text-white">
                Movimento do caixa
              </h3>
            </div>
            <ChartNoAxesCombined className="h-6 w-6 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#e6e1e8] bg-background-light p-4 dark:border-[#452b4d] dark:bg-[#382240]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/70">
                Saldo inicial
              </p>
              <p className="text-2xl font-extrabold text-text-main dark:text-white">
                R$ 0,00
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6e1e8] bg-background-light p-4 dark:border-[#452b4d] dark:bg-[#382240]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/70">
                Entradas
              </p>
              <p className="text-2xl font-extrabold text-text-main dark:text-white">
                R$ 0,00
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6e1e8] bg-background-light p-4 dark:border-[#452b4d] dark:bg-[#382240]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/70">
                Saídas
              </p>
              <p className="text-2xl font-extrabold text-text-main dark:text-white">
                R$ 0,00
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6e1e8] bg-background-light p-4 dark:border-[#452b4d] dark:bg-[#382240]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/70">
                Saldo atual
              </p>
              <p className="text-2xl font-extrabold text-text-main dark:text-white">
                R$ 0,00
              </p>
            </div>
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
}
