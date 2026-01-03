"use client";

import { FormEvent, useState } from "react";
import { useLogin } from "@/app/hooks/useLogin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function LoginForm() {
  const { login, loading } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login({ username, password });
    if (!result.ok && result.error) {
      toast.error("Usuário ou senha inválidos.");
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Card className="p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tight text-text-main dark:text-white">
            Acessar Sistema
          </h2>
          <p className="mt-2 text-sm text-text-secondary dark:text-[#bcaec4]">
            Entre com seu usuário e senha para continuar.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-2 block" htmlFor="username">
              Username
            </Label>
            <div className="group relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 100))}
                placeholder="Digite seu usuário"
                className="pl-12"
                tabIndex={0}
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="password">
              Senha
            </Label>
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 100))}
                placeholder="••••••••"
                className="pl-12 pr-12"
                tabIndex={0}
                maxLength={100}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={loading || !username || !password}
            tabIndex={0}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </>
  );
}
