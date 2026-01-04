"use client";

import { useState } from "react";
import {
  Shirt,
  ShoppingBag,
  Package,
  Tags,
  Gift,
  ShoppingCart,
  Wallet,
  CreditCard,
  Receipt,
  Box,
  Briefcase,
  Handbag,
  Diamond,
  Watch,
  Baby,
  ShoppingBasket,
  Sofa,
  Lamp,
  Bed,
  Monitor,
  Speaker,
  Refrigerator,
  WashingMachine,
  Luggage,
  User,
  UserSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/utils/cn";

const AVAILABLE_ICONS = [
  { value: "Shirt", label: "Roupas (Masc.)", Icon: Shirt },
  { value: "Handbag", label: "Roupas (Fem.)", Icon: Handbag },
  { value: "Briefcase", label: "Acessórios", Icon: Briefcase },
  { value: "Diamond", label: "Bijuterias", Icon: Diamond },
  { value: "Watch", label: "Relógios", Icon: Watch },
  { value: "Baby", label: "Bebê / Infantil", Icon: Baby },
  { value: "ShoppingBag", label: "Calçados / Sacola", Icon: ShoppingBag },
  { value: "ShoppingBasket", label: "Cesta / Produtos", Icon: ShoppingBasket },
  { value: "ShoppingCart", label: "Carrinho", Icon: ShoppingCart },
  { value: "Package", label: "Pacote / Estoque", Icon: Package },
  { value: "Tags", label: "Etiquetas", Icon: Tags },
  { value: "Gift", label: "Presentes", Icon: Gift },
  { value: "Wallet", label: "Carteira", Icon: Wallet },
  { value: "CreditCard", label: "Pagamento", Icon: CreditCard },
  { value: "Receipt", label: "Recibo", Icon: Receipt },
  { value: "Box", label: "Caixa", Icon: Box },
  { value: "Sofa", label: "Móveis", Icon: Sofa },
  { value: "Lamp", label: "Iluminação", Icon: Lamp },
  { value: "Bed", label: "Cama/Móveis", Icon: Bed },
  { value: "Monitor", label: "Eletrônicos", Icon: Monitor },
  { value: "Speaker", label: "Áudio", Icon: Speaker },
  { value: "Refrigerator", label: "Eletrodomésticos", Icon: Refrigerator },
  { value: "WashingMachine", label: "Lavanderia", Icon: WashingMachine },
  { value: "Luggage", label: "Viagem", Icon: Luggage },
  { value: "User", label: "Masculino", Icon: User },
  { value: "UserSquare", label: "Feminino", Icon: UserSquare },
];

type IconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {AVAILABLE_ICONS.map(({ value: iconValue, label, Icon }) => {
        const isActive = value === iconValue;
        const isFocused = focused === iconValue;
        return (
          <Button
            key={iconValue}
            type="button"
            variant={isActive ? "default" : "outline"}
            className={cn(
              "flex w-full items-center gap-2 border border-border py-2",
              isActive && "ring-2 ring-primary",
              isFocused && !isActive && "border-primary"
            )}
            onClick={() => onChange(iconValue)}
            onFocus={() => setFocused(iconValue)}
            onBlur={() => setFocused(null)}
            tabIndex={0}
            aria-pressed={isActive}
            aria-label={`Selecionar ícone ${label}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-semibold">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}
