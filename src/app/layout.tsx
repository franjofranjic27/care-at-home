import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  title: "Care@Home",
  description: "Die Untersuchung kommt zu Ihnen nach Hause.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0040F8",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH" className={atkinson.variable}>
      <body>{children}</body>
    </html>
  );
}
