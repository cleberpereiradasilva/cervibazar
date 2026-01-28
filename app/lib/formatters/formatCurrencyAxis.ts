export function formatCurrencyAxis(raw: number | null | undefined) {
  const val = Number(raw ?? 0);
  if (!Number.isFinite(val)) return "R$ 0";
  if (Math.abs(val) >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)}M`;
  if (Math.abs(val) >= 1_000) return `R$ ${(val / 1_000).toFixed(1)}k`;
  return `R$ ${val.toFixed(0)}`;
}
