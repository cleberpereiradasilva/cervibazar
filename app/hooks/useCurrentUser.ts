"use client";

import { useEffect, useState } from "react";
import { getClientToken } from "@/app/lib/auth/getClientToken";

type CurrentUser = {
  id: string;
  name: string;
  role: "admin" | "caixa";
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

  const refreshUser = () => {
    const token = getClientToken();
    if (!token) {
      setUser(null);
      return;
    }

    const name = fromCookie("user_name");
    const role = fromCookie("user_role") as "admin" | "caixa" | "";
    const id = fromCookie("user_id");

    if (name && role) {
      setUser({ id: id || "unknown", name, role: role === "admin" ? "admin" : "caixa" });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
    const handler = () => refreshUser();
    window.addEventListener("user:updated", handler);
    return () => window.removeEventListener("user:updated", handler);
  }, []);

  return { user, refreshUser };
}
