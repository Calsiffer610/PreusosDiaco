import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miller | Formularios Operativos",
  description: "Frontend para digitalizar inspecciones de pre-uso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
