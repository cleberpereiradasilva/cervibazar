"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "sonner";
import { useHomeMessage } from "@/app/hooks/useHomeMessage";

export default function FraseClientPage() {
  const { message, loading, saving, error, save } = useHomeMessage();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(message);
  }, [message]);

  const handleSave = async () => {
    const result = await save(value);
    if (result.ok) {
      toast.success("Frase salva.");
      return;
    }
    if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div>
        <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
          Frase
        </h2>
        <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
          Configure a mensagem exibida na tela inicial.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Mensagem</p>
          <Button onClick={handleSave} disabled={loading || saving} className="gap-2">
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
        <Separator />
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className="w-full rounded-[var(--radius)] border border-border bg-background-light px-4 py-3 text-sm font-semibold text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
          placeholder="Digite a frase que aparece na tela inicial"
        />
        <div className="text-xs text-text-secondary">
          {value.trim().length}/200
        </div>
      </Card>
    </div>
  );
}
