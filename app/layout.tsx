import type React from "react";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import CustomCursor from "@/components/custom-cursor";
import Footer from "@/components/footer";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Serif font (Lust Display) is loaded from Adobe Fonts via typekit
// CSS variable --font-serif is defined in globals.css

export const metadata = {
  title: "Pixel Czar vNext - Will Smith",
  description:
    "Product design, leadership, visuals, systems thinking, brand, prototypes.",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/images/favicon.ico", sizes: "any" },
      { url: "/images/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/images/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <link rel="stylesheet" href="https://use.typekit.net/iyr2zsg.css" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="pixel-czar-theme"
          disableTransitionOnChange={false}
        >
          <CustomCursor />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
