import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteName = "INNOV5 GLOBAL HUB";
const siteDescription =
  "INNOV5 GLOBAL HUB turns bold ideas into meaningful digital experiences through web development, software solutions, branding, digital commerce, and business technology.";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3001"),

  title: {
    default: "INNOV5 GLOBAL HUB | Innovating Tomorrow, Today",
    template: "%s | INNOV5 GLOBAL HUB",
  },

  description: siteDescription,

  applicationName: siteName,

  keywords: [
    "INNOV5 GLOBAL HUB",
    "technology company",
    "digital innovation",
    "web development",
    "software development",
    "business technology",
    "VendiLink",
    "digital commerce",
    "branding and graphic design",
    "digital solutions",
  ],

  openGraph: {
    title: "INNOV5 GLOBAL HUB | Innovating Tomorrow, Today",
    description: siteDescription,
    siteName,
    type: "website",
    locale: "en_NG",
  },

  twitter: {
    card: "summary_large_image",
    title: "INNOV5 GLOBAL HUB | Innovating Tomorrow, Today",
    description: siteDescription,
  },

  robots: {
    index: false,
    follow: false,
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