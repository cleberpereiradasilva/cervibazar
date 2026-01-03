import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
        className={`${manrope.variable} bg-background-light text-text-main antialiased dark:bg-background-dark dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
