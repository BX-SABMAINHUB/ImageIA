import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nano Banana AI | Generador de Arte',
  description: 'Crea imágenes increíbles con IA en segundos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-neutral-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
