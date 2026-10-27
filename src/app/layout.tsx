import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteName = "INNOV5 GLOBAL HUB";

const siteDescription =
  "INNOV5 GLOBAL HUB turns bold ideas into meaningful digital experiences through web development, software solutions, branding, digital commerce, and business technology.";

const siteUrl = "https://innov5-global-hub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  verification: {
    google: "3bFCv23jylIX7Lea8-aXWQubNtUz_0q5hMooveAOIhQ",
  },

  title: {
    default: "INNOV5 GLOBAL HUB | Innovating Tomorrow, Today",
    template: "%s | INNOV5 GLOBAL HUB",
  },

  description: siteDescription,

  applicationName: siteName,

  keywords: [
    "INNOV5 GLOBAL HUB",
    "technology company in Nigeria",
    "digital innovation",
    "web development",
    "software development",
    "business technology",
    "VendiLink",
    "digital commerce",
    "branding and graphic design",
    "digital solutions",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "INNOV5 GLOBAL HUB | Innovating Tomorrow, Today",
    description: siteDescription,
    siteName,
    url: siteUrl,
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/innov5-global-hub-logo.png",
        alt: "INNOV5 GLOBAL HUB logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "INNOV5 GLOBAL HUB | Innovating Tomorrow, Today",
    description: siteDescription,
    images: ["/innov5-global-hub-logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080a13",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <body>{children}</body>
    </html>
  );
}
