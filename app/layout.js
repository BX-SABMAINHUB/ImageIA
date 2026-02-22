// app/layout.js
import "./globals.css";

export const metadata = {
  title: "GIGA FREE - AI Generator",
  description: "Generador de imágenes profesional gratuito",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
