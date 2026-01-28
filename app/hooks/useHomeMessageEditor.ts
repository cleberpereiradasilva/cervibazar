"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHomeMessage } from "@/app/hooks/useHomeMessage";

export function useHomeMessageEditor() {
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

  return {
    value,
    setValue,
    loading,
    saving,
    error,
    handleSave,
    count: value.trim().length,
  };
}
