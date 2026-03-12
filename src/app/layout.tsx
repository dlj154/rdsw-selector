import type { Metadata } from "next";
import { Hanken_Grotesk, Archivo } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RDSW Session Selector | Raleigh-Durham Startup Week 2026",
  description:
    "Build your perfect schedule for Raleigh-Durham Startup Week 2026. Filter by topic, location, and popularity to find your ideal sessions.",
  openGraph: {
    title: "RDSW Session Selector",
    description: "Build your perfect Raleigh-Durham Startup Week 2026 schedule",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} ${archivo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
