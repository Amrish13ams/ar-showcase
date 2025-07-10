import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers" // ✅ Import the new client wrapper

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AR Showcase Platform",
  description: "Experience products in Augmented Reality",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="module"
          src="https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* ✅ Only this part is client */}
      </body>
    </html>
  )
}
