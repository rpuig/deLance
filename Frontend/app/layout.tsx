import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { SiteLayout } from "@/components/site-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "deLance - Plataforma de Freelancers en Solana",
  description:
    "Conecta, trabaja y cobra en Solana. La plataforma descentralizada que conecta freelancers y clientes con pagos seguros a través de smart contracts.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <SiteLayout>{children}</SiteLayout>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
