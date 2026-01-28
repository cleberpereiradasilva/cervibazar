"use client";

import { useCallback, useEffect, useState } from "react";
import { getClientToken } from "@/app/lib/auth/getClientToken";

type CurrentUser = {
  id: string;
  name: string;
  role: "admin" | "caixa" | "root";
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const fromCookie = (key: string) => {
    if (typeof document === "undefined") return "";
    const entry = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${key}=`));
    if (!entry) return "";
    const [, value] = entry.split("=");
    return value ? decodeURIComponent(value) : "";
  };

  const refreshUser = useCallback(() => {
    const token = getClientToken();
    if (!token) {
      setUser(null);
      return;
    }

    const name = fromCookie("user_name");
    const role = fromCookie("user_role") as "admin" | "caixa" | "root" | "";
    const id = fromCookie("user_id");

    if (name && role) {
      setUser({
        id: id || "unknown",
        name,
        role: role === "root" ? "root" : role === "admin" ? "admin" : "caixa",
      });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    const handler = () => refreshUser();
    window.addEventListener("user:updated", handler);
    return () => window.removeEventListener("user:updated", handler);
  }, [refreshUser]);

  return { user, refreshUser };
}
