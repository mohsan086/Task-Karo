import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: {
    default: "Task-Karo - Modern Task Management",
    template: "%s | Task-Karo",
  },
  description:
    "A comprehensive task management application with real-time updates, team collaboration, and powerful analytics. Organize your task efficiently with Task-Karo.",
  keywords: ["task management", "productivity", "collaboration", "project management", "task-karo", "team"],
  authors: [{ name: "Task-Karo Team" }],
  creator: "Task-Karo",
  publisher: "Task-Karo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://task-karo.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Task-Karo - Modern Task Management",
    description:
      "A comprehensive task management application with real-time updates, team collaboration, and powerful analytics.",
    siteName: "Task-Karo",
    images: [
      {
        url: "app/public/og-image.png",
        width: 1200,
        height: 630,
        alt: "Task-Karo - Modern Task Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Task-Karo - Modern Task Management",
    description:
      "A comprehensive task management application with real-time updates, team collaboration, and powerful analytics.",
    images: ["<app /public/og-image.png"],
    creator: "@task-Karo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
    generator: 'Task-Karo App'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>{children}</body>
    </html>
  )
}
