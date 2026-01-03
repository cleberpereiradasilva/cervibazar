"use client";

import { useEffect, useMemo, useState } from "react";
import { AtSign, Eye, EyeOff, Info, Lock, LockKeyhole, Save, UserPlus } from "lucide-react";
import { userInputSchema } from "@/app/lib/validators/userInputSchema";
import { userUpdateSchema } from "@/app/lib/validators/userUpdateSchema";
import { z } from "zod";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Card } from "../../components/ui/card";

const nameSchema = z
  .string()
  .trim()
  .min(5, "Nome e sobrenome devem ter pelo menos 5 caracteres.")
  .max(120, "Nome e sobrenome devem ter no maximo 120 caracteres.")
  .regex(/^[A-Za-z]+(?:\s+[A-Za-z]+)+$/, "Informe nome e sobrenome (apenas letras e espacos).");

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Login deve ter pelo menos 5 caracteres.")
  .max(50, "Login deve ter no maximo 50 caracteres.")
  .regex(/^[a-z]+\.[a-z]+$/, "Use o formato nome.sobrenome apenas com letras.");

const roleSchema = z.enum(["admin", "caixa"], {
  errorMap: () => ({ message: "Selecione um perfil valido." }),
});

const passwordSchema = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres.")
  .max(64, "Senha deve ter no maximo 64 caracteres.")
  .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiuscula.")
  .regex(/[0-9]/, "Senha deve ter pelo menos um numero.");

type UserFormProps = {
  onSubmit: (input: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: "admin" | "caixa";
  }) => Promise<{ ok: boolean; error: string | null }>;
  onCancelEdit: () => void;
  editingUser?: {
    id: string;
    name: string;
    username: string;
    role: "admin" | "caixa";
  } | null;
  saving: boolean;
  error?: string | null;
};

export default function UserForm({
  onSubmit,
  onCancelEdit,
  editingUser,
  saving,
  error,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "caixa" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<
      Record<
        | keyof Omit<
            UserFormProps["onSubmit"] extends (input: infer T) => any
              ? T
              : never,
            "role"
          >
        | "role",
        string
      >
    >
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<"name" | "username" | "password" | "confirmPassword" | "role", boolean>>
  >({});

  const schema = useMemo(
    () => (editingUser ? userUpdateSchema() : userInputSchema()),
    [editingUser]
  );

  type FieldKey = "name" | "username" | "password" | "confirmPassword" | "role";

  const validateField = (field: FieldKey, overrides?: Partial<Record<FieldKey, string>>) => {
    const current = {
      name,
      username,
      password,
      confirmPassword,
      role,
      ...overrides,
    };

    if (field === "name") {
      const parsed = nameSchema.safeParse(current.name);
      setFieldErrors((prev) => ({
        ...prev,
        name: parsed.success ? undefined : parsed.error.flatten().fieldErrors.name?.[0] ?? "Nome invalido.",
      }));
      return;
    }

    if (field === "username") {
      const parsed = usernameSchema.safeParse(current.username);
      setFieldErrors((prev) => ({
        ...prev,
        username: parsed.success ? undefined : parsed.error.flatten().fieldErrors.username?.[0] ?? "Login invalido.",
      }));
      return;
    }

    if (field === "password") {
      const parsed =
        editingUser && current.password.length === 0
          ? { success: true }
          : passwordSchema.safeParse(current.password);
      setFieldErrors((prev) => ({
        ...prev,
        password: parsed.success ? undefined : ("error" in parsed ? parsed.error.issues[0]?.message ?? "Senha invalida." : "Senha invalida."),
      }));
      return;
    }

    if (field === "confirmPassword") {
      const passwordProvided = current.password.length > 0;
      const parsed =
        editingUser && !passwordProvided && current.confirmPassword.length === 0
          ? { success: true }
          : passwordSchema.safeParse(current.confirmPassword);

      const lengthMessage =
        parsed.success === false ? parsed.error.issues[0]?.message : undefined;

      const emptyConfirmMessage =
        passwordProvided && current.confirmPassword.length === 0
          ? "Confirme a senha."
          : undefined;

      const mismatchMessage =
        passwordProvided &&
        current.confirmPassword.length > 0 &&
        current.password !== current.confirmPassword
          ? "As senhas precisam ser iguais."
          : undefined;

      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword:
          emptyConfirmMessage || lengthMessage || mismatchMessage || undefined,
      }));
      return;
    }

    const parsed = roleSchema.safeParse(current.role);
    setFieldErrors((prev) => ({
      ...prev,
      role: parsed.success ? undefined : parsed.error.flatten().fieldErrors.role?.[0] ?? "Perfil invalido.",
    }));
  };

  const resetForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setFeedback(null);
    setFieldErrors({});
    setTouched({});
  };

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setUsername(editingUser.username);
      setRole(editingUser.role);
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});
      setFeedback(null);
      setTouched({});
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUser?.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setFieldErrors({});
    const basePayload = {
      name,
      username,
      password,
      confirmPassword,
      role,
      id: editingUser?.id,
    };

    const parseResult = editingUser
      ? userUpdateSchema().safeParse(basePayload)
      : userInputSchema().safeParse(basePayload);

    if (!parseResult.success) {
      const { fieldErrors: issues, formErrors } = parseResult.error.flatten();
      setFieldErrors({
        name: issues.name?.[0],
        username: issues.username?.[0],
        password: issues.password?.[0],
        confirmPassword: issues.confirmPassword?.[0] ?? formErrors[0],
        role: issues.role?.[0],
      });
      setFeedback(null);
      return;
    }

    const result = await onSubmit(parseResult.data);

    if (result.ok) {
      setFeedback("Usuário salvo com sucesso.");
      resetForm();
      onCancelEdit();
      return;
    }

    if (result.error) {
      setFeedback(result.error);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-text-main dark:border-[#452b4d] dark:text-white">
        <UserPlus className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">
          {editingUser ? "Editar Usuário" : "Dados do Usuário"}
        </h3>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 ml-1 block" htmlFor="name">
              Nome Completo
            </Label>
            <div className="group relative">
              <AtSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" />
              <Input
                id="name"
                placeholder="Nome e sobrenome"
                aria-required="true"
                className="pl-12"
                value={name}
                onChange={(event) => {
                  const value = event.target.value;
                  setName(value);
                  setTouched((prev) => ({ ...prev, name: true }));
                  validateField("name", { name: value });
                }}
                onBlur={() => touched.name && validateField("name")}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 ml-1 block" htmlFor="username">
              Login de Acesso
            </Label>
            <div className="group relative">
              <AtSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" />
              <Input
                id="username"
                placeholder="nome.sobrenome"
                aria-required="true"
                className="pl-12"
                value={username}
                onChange={(event) => {
                  const value = event.target.value;
                  setUsername(value);
                  setTouched((prev) => ({ ...prev, username: true }));
                  validateField("username", { username: value });
                }}
                onBlur={() => touched.username && validateField("username")}
              />
            </div>
            <p className="ml-1 mt-1 text-xs text-text-secondary/60">
              Formato exigido: nome.sobrenome
            </p>
            {fieldErrors.username && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 ml-1 block" htmlFor="role">
              Perfil
            </Label>
            <Select
              id="role"
              options={[
                { value: "admin", label: "Administrador" },
                { value: "caixa", label: "Operador de Caixa" },
              ]}
              value={role}
              onChange={(event) => {
                const value = event.target.value as "admin" | "caixa" | "";
                setRole(value);
                setTouched((prev) => ({ ...prev, role: true }));
                validateField("role", { role: value });
              }}
              onBlur={() => touched.role && validateField("role")}
              placeholder="Selecione um perfil"
            />
            {fieldErrors.role && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.role}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 ml-1 block" htmlFor="password">
              Senha
            </Label>
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="pl-12 pr-12"
                value={password}
                onChange={(event) => {
                  const value = event.target.value;
                  setPassword(value);
                  setTouched((prev) => ({ ...prev, password: true }));
                  validateField("password", { password: value });
                  if (touched.confirmPassword) {
                    validateField("confirmPassword", {
                      password: value,
                      confirmPassword,
                    });
                  }
                }}
                onBlur={() => touched.password && validateField("password")}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-primary focus:outline-none"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 ml-1 block" htmlFor="confirmPassword">
              Confirmação de Senha
            </Label>
            <div className="group relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" />
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                className="pl-12 pr-12"
                value={confirmPassword}
                onChange={(event) => {
                  const value = event.target.value;
                  setConfirmPassword(value);
                  setTouched((prev) => ({ ...prev, confirmPassword: true }));
                  validateField("confirmPassword", {
                    password,
                    confirmPassword: value,
                  });
                }}
                onBlur={() =>
                  touched.confirmPassword && validateField("confirmPassword")
                }
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-primary focus:outline-none"
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                aria-label={
                  showConfirmPassword
                    ? "Esconder confirmação de senha"
                    : "Mostrar confirmação de senha"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="ml-1 mt-1 text-xs text-text-secondary/60">
              Minimo 8 caracteres, com maiuscula e numero.
            </p>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {(feedback || error) && (
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              {feedback || error}
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2 md:flex-row md:justify-end">
            <Button
              className="gap-2"
              type="submit"
              disabled={saving}
              tabIndex={0}
            >
              <Save className="h-5 w-5" />
              {saving
                ? "Salvando..."
                : editingUser
                  ? "Atualizar"
                  : "Salvar"}
            </Button>
            <Button
              variant="outline"
              className="gap-2 border border-[#e6e1e8] dark:border-[#452b4d]"
              type="button"
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
              disabled={saving}
              tabIndex={0}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
