"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "sonner";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { me } from "@/app/actions/auth/me";
import { updateProfile } from "@/app/actions/users/updateProfile";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  onClose?: () => void;
};

export default function ProfileForm({ onClose }: Props) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const getErrorMessage = (error: any, fallback: string) => {
    const tryParseJsonArray = (val: string) => {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed[0]?.message) {
          return String(parsed[0].message);
        }
      } catch {
        return null;
      }
      return null;
    };

    if (error?.issues && Array.isArray(error.issues) && error.issues[0]?.message) {
      return String(error.issues[0].message);
    }
    if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
      const msg = error.errors[0]?.message;
      if (msg) return String(msg);
    }
    if (typeof error?.message === "string") {
      const parsed = tryParseJsonArray(error.message);
      if (parsed) return parsed;
      return error.message;
    }
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === "string") return error;
    return fallback;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada.");
        const user = await me(token);
        setId(user.id);
        setName(user.name);
        setUsername(user.username);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar perfil.");
      }
    };
    void load();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada.");
      const updated = await updateProfile(token, {
        id,
        name,
        username,
        password: "",
        confirmPassword: "",
      });
      toast.success("Dados atualizados com sucesso.");
      const attrs = `path=/; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      } max-age=${60 * 60}`;
      document.cookie = `user_name=${encodeURIComponent(updated.name)}; ${attrs}`;
      document.cookie = `user_username=${encodeURIComponent(updated.username)}; ${attrs}`;
      window.dispatchEvent(new Event("user:updated"));
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Erro ao atualizar dados."));
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada.");
      await updateProfile(token, {
        id,
        name,
        username,
        password,
        confirmPassword,
      });
      setPassword("");
      setConfirmPassword("");
      toast.success("Senha atualizada com sucesso.");
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Erro ao atualizar senha."));
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Card className="p-4">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-text-main dark:text-white">Meu Perfil</h3>
          <p className="text-sm text-text-secondary dark:text-[#bcaec4]">
            Atualize seus dados de acesso.
          </p>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              tabIndex={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Login (nome.sobrenome)</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              maxLength={50}
              tabIndex={0}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loadingProfile}>
              {loadingProfile ? "Salvando..." : "Salvar dados"}
            </Button>
          </div>
        </form>

        <Separator />

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={64}
                tabIndex={0}
                className="pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={64}
                tabIndex={0}
                className="pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Esconder confirmação" : "Mostrar confirmação"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loadingPassword}>
              {loadingPassword ? "Salvando..." : "Atualizar senha"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
