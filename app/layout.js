import "./globals.css";

export const metadata = {
  title: "GIGA FREE AI | PRO EDITION 2026",
  description: "Advanced Neural Image Generation System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-black text-white selection:bg-yellow-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
