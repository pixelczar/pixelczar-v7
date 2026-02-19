import type React from "react";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import CustomCursor from "@/components/custom-cursor";
import Footer from "@/components/footer";
import "./globals.css";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Analytics } from "@vercel/analytics/react";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Serif font (Lust Display) is loaded from Adobe Fonts via typekit
// CSS variable --font-serif is defined in globals.css

export const metadata = {
  metadataBase: new URL("https://pixelczar.com"),
  title: {
    default: "Will Smith - Product Designer & Design Leader",
    template: "%s • Will Smith",
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
    siteName: "Will Smith - Designer & Builder",
    title: "Will Smith - Product Designer & Design Leader",
    description:
      "Product design, leadership, visuals, systems thinking, brand, and prototypes. 15+ years designing at high-growth venture-backed startups.",
    images: [
      {
        url: "/images/pixel-czar-og-img.png",
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
    images: ["/images/pixel-czar-og-img.png"],
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
      className={archivo.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <link rel="stylesheet" href="https://use.typekit.net/iyr2zsg.css" />
        <style>{`.tk-lust-display { font-display: swap; }`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(key) {if (window.reb2b) return;window.reb2b = {loaded: true};var s = document.createElement("script");s.async = true;s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);}("W6Z57HZQLXOX");`,
          }}
        />
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
              image: "https://pixelczar.com/images/pixel-czar-og-img.png",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
          style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        >
          Skip to content
        </a>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="pixel-czar-theme"
            disableTransitionOnChange={false}
          >
            <div id="main-content">{children}</div>
          </ThemeProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}