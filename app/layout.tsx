import type { Metadata } from "next";
import "./globals.css";

const faviconDataUrl =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzRFOjEBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc1Nzc3NzctNzU3Nzc3Nzc3NzcrNzctNzc3Nzc3NzctKyw0LSstKzcuN//AABEIABwAHAMBIgACEQEDEQH/xAAZAAEAAgMAAAAAAAAAAAAAAAAEAwUBAgf/xAApEAACAQMCBQMFAQAAAAAAAAABAgMABBESMQUTIVFhIkFxMkKRocEU/8QAFwEBAQEBAAAAAAAAAAAAAAAAAQIDAP/EABgRAQADAQAAAAAAAAAAAAAAAAEAAhEh/9oADAMBAAIRAxEAPwDsl9cSLNFbW2OdLk6iMhFG5qUQyrHhZ3L93AI/AoUUok4vHIw067YjSd1YMMj90i6v0iBjgHPuPtiTqc+ew8mqSZidWb8Puv8AXBrK6HVijrnZgcGlVT8HMkNrIqxmZ1kYyuCBqfPqC98be21WdtcR3MKyxHKt3GCO4PmhOxpbQ2QcQtTOivGFM0R1JqHQ9wfBrNlcQSqUjURyL9cRGGU/H9pBO1QXNtBcgGeFHK7EjqPg10WvdIVmXhCTPIQ1szl1APqVjuAPfrt71DwmS4tbU86yuGklkeVgoXCajnHUimwWFrE/NSEGRdnYliPgnamU7JKO7P/Z";

export const metadata: Metadata = {
  title: "Cervi Bazar | Dashboard",
  description: "Interface do sistema de caixa e vendas.",
  icons: {
    icon: faviconDataUrl,
  },
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
