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
        const attrs = `path=/; SameSite=Lax; ${
          process.env.NODE_ENV === "production" ? "Secure;" : ""
        } max-age=${60 * 60}`;
        document.cookie = `auth_token=${encodeURIComponent(result.token)}; ${attrs}`;
        document.cookie = `user_name=${encodeURIComponent(result.name)}; ${attrs}`;
        document.cookie = `user_role=${encodeURIComponent(result.role)}; ${attrs}`;
        document.cookie = `user_id=${encodeURIComponent(result.id)}; ${attrs}`;
        document.cookie = `user_username=${encodeURIComponent(result.username)}; ${attrs}`;
        router.refresh();
        router.push("/");
        return { ok: true, error: null, token: result.token };
      } catch {
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
