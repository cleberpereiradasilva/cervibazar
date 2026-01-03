export function getClientToken() {
  if (typeof document === "undefined") return "";

  const tokenEntry = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("auth_token="));

  if (!tokenEntry) return "";

  const [, value] = tokenEntry.split("=");
  return value ? decodeURIComponent(value) : "";
}
