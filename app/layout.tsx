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
  title: {
    default: "Will Smith - Product Designer & Design Leader",
    template: "%s | Will Smith",
  },
  description:
    "Product design, leadership, visuals, systems thinking, brand, and prototypes. 15+ years designing at high-growth venture-backed startups.",
  keywords: [
    "product design",
    "design leadership",
    "UX design",
    "UI design",
    "B2B SaaS",
    "design systems",
    "brand design",
    "prototyping",
    "user experience",
    "visual design",
  ],
  authors: [{ name: "Will Smith" }],
  creator: "Will Smith",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixelczar.com",
    siteName: "Will Smith - Product Designer",
    title: "Will Smith - Product Designer & Design Leader",
    description:
      "Product design, leadership, visuals, systems thinking, brand, and prototypes. 15+ years designing at high-growth venture-backed startups.",
    images: [
      {
        url: "/images/will-smith-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Will Smith - Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Will Smith - Product Designer & Design Leader",
    description:
      "Product design, leadership, visuals, systems thinking, brand, and prototypes.",
    images: ["/images/will-smith-profile.jpg"],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Will Smith",
              jobTitle: "Product Designer & Design Leader",
              description:
                "Product design, leadership, visuals, systems thinking, brand, and prototypes. 15+ years designing at high-growth venture-backed startups.",
              url: "https://pixelczar.com",
              image: "https://pixelczar.com/images/will-smith-profile.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Beverly",
                addressRegion: "MA",
                addressCountry: "US",
              },
              sameAs: [
                "https://linkedin.com/in/pixelczar",
                "https://dribbble.com/willus",
                "https://github.com/pixelczar",
              ],
              knowsAbout: [
                "Product Design",
                "UX Design",
                "UI Design",
                "Design Systems",
                "Design Leadership",
                "Brand Design",
                "Prototyping",
                "B2B SaaS",
              ],
            }),
          }}
        />
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
