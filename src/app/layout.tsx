import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

// Use CSS custom properties for fonts - set in globals.css
// This avoids network requests during build while providing consistent font styling

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
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
