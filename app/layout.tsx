import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cervi Bazar | Dashboard",
  description: "Interface do sistema de caixa e vendas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`bg-background-light text-text-main antialiased dark:bg-background-dark dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
