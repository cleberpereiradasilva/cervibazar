import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDumpContent } from "@/app/lib/dumps/dumpStorage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rawCookie = request.headers.get("cookie") ?? "";
  const cookieMap = Object.fromEntries(
    rawCookie
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const idx = entry.indexOf("=");
        if (idx === -1) return [entry, ""];
        return [entry.slice(0, idx), entry.slice(idx + 1)];
      })
  );
  const rawToken = cookieMap["auth_token"] ?? "";
  const token = rawToken ? decodeURIComponent(rawToken) : "";
  if (!token) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const payload = await verifyAuthToken(token);
  if (payload.role !== "root") {
    return NextResponse.json({ message: "Acesso restrito." }, { status: 403 });
  }

  const resolvedParams = await params;
  const id = decodeURIComponent(resolvedParams.id ?? "");
  const dump = await getDumpContent(id);
  if (!dump) {
    return NextResponse.json({ message: "Arquivo não encontrado." }, { status: 404 });
  }

  const buffer = Buffer.from(dump.content, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${dump.name}"`,
    },
  });
}
