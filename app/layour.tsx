import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { DM_Sans } from "next/font/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "建設現場向け案件・スケジュール管理システム",
  description: "建設現場の担当者がスマートフォンから簡単に案件情報を入力・管理できるWebアプリケーション",
  generator: "Next.js",
}

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${dmSans.variable} antialiased`}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-dm-sans: ${dmSans.style.fontFamily};
}
        `}</style>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
