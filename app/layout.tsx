import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

// 1. Configuramos Inter (Ideal para textos largos y párrafos)
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// 2. Configuramos Montserrat (Ideal para Títulos y botones)
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ViOs Code | Matriz",
  description: "Redefiniendo la Realidad Digital de tu Negocio.",
  // 🔥 NUEVO: Referencia explícita al nuevo favicon.ico
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Inyectamos las dos fuentes en la raíz de la página
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      {/* Por defecto, todo el texto de la página usará Inter (font-inter) */}
      <body className="font-inter bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}