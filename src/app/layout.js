import { Inter, Work_Sans, JetBrains_Mono, Patrick_Hand } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AosInit from "@/components/AosInit";
import ThemeStyle from "@/components/ThemeStyle";
import {
  BUSINESS,
  CITY_STATE,
  SITE_URL,
  buildAllJsonLd,
} from "@/lib/seo";

// Per-business: set NEXT_PUBLIC_GA_MEASUREMENT_ID in the site's env (Netlify).
// Falls back to the First Step property when the var is not defined at build time.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-D1QT0J7VPN";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-patrick-hand", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.brandName} | ${CITY_STATE}`,
    template: `%s | ${BUSINESS.brandName}`,
  },
  description: BUSINESS.shortDescription,
  applicationName: BUSINESS.brandName,
  authors: [{ name: BUSINESS.legalName, url: SITE_URL }],
  creator: BUSINESS.legalName,
  publisher: BUSINESS.legalName,
  category: BUSINESS.category,
  keywords: BUSINESS.keywords,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BUSINESS.brandName,
    title: `${BUSINESS.brandName} | ${CITY_STATE}`,
    description: BUSINESS.shortDescription,
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: `${BUSINESS.brandName} — ${CITY_STATE} ${BUSINESS.primaryService}`,
      },
      {
        url: "/images/hero-trailer.jpg",
        alt: `${BUSINESS.brandName} on a ${BUSINESS.address.addressLocality} job`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.brandName} | ${CITY_STATE}`,
    description: BUSINESS.shortDescription,
    images: ["/images/logo.png"],
  },
  icons: {
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    apple: [{ url: "/images/logo.png" }],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "geo.region": `US-${BUSINESS.address.addressRegion}`,
    "geo.placename": BUSINESS.address.addressLocality,
    "geo.position": `${BUSINESS.geo.latitude};${BUSINESS.geo.longitude}`,
    ICBM: `${BUSINESS.geo.latitude}, ${BUSINESS.geo.longitude}`,
    "business:contact_data:locality": BUSINESS.address.addressLocality,
    "business:contact_data:region": BUSINESS.address.addressRegion,
    "business:contact_data:country_name": "United States",
    "business:contact_data:phone_number": BUSINESS.phoneDisplay,
    "business:contact_data:email": BUSINESS.email,
    "business:contact_data:website": SITE_URL,
  },
};

const jsonLd = buildAllJsonLd();

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${workSans.variable} ${jetbrainsMono.variable} ${patrickHand.variable} scroll-smooth antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeStyle />
      </head>
      <body className="bg-background text-on-surface font-body-md text-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        <AosInit />
        {children}
      </body>
    </html>
  );
}
