import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Composition - Deconstruct Anything",
  description:
    "AI-powered composition analysis. Deconstruct any product, substance, or entity into its constituent parts with interactive 3D visualization.",
  keywords: [
    "composition",
    "analysis",
    "ingredients",
    "materials",
    "elements",
    "3D visualization",
  ],
  authors: [{ name: "Composition" }],
  openGraph: {
    title: "Composition - Deconstruct Anything",
    description:
      "AI-powered composition analysis with interactive 3D visualization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
