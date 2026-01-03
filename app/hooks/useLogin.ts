"use client";

import { useCallback, useState } from "react";
import { login } from "@/app/actions/auth/login";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(
    async (input: { username: string; password: string }) => {
      setLoading(true);
      try {
        const result = await login(input);
        // Salva token em cookie acessível no client
        const encodedToken = encodeURIComponent(result.token);
        document.cookie = `auth_token=${encodedToken}; path=/; SameSite=Lax; ${
          process.env.NODE_ENV === "production" ? "Secure;" : ""
        } max-age=${60 * 60}`;
        router.refresh();
        router.push("/");
        return { ok: true, error: null, token: result.token };
      } catch (err) {
        const message = "Usuário ou senha inválidos.";
        return { ok: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return { loading, login: handleLogin };
}
