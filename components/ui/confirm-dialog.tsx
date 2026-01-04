import React from "react";
import { Button } from "./button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmTone?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Deletar",
  cancelLabel = "Cancelar",
  confirmTone = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? "confirm-dialog-description" : undefined}
    >
      <div className="w-full max-w-md rounded-[var(--radius)] bg-surface-light p-6 shadow-xl outline outline-1 outline-border dark:bg-surface-dark dark:outline-[#452b4d]">
        <div className="space-y-2">
          <h3
            id="confirm-dialog-title"
            className="text-lg font-bold text-text-main dark:text-white"
          >
            {title}
          </h3>
          {description && (
            <p
              id="confirm-dialog-description"
              className="text-sm text-text-secondary dark:text-[#bcaec4]"
            >
              {description}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="gap-2 border border-[#e6e1e8] dark:border-[#452b4d]"
            onClick={onCancel}
            disabled={loading}
            tabIndex={0}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className={`gap-2 ${confirmTone === "danger" ? "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600" : ""}`}
            onClick={onConfirm}
            disabled={loading}
            tabIndex={0}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
