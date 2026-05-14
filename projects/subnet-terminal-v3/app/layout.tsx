import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces, Geist } from "next/font/google";
import "./globals.css";

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Subneτ Terminal — a research terminal for decentralized intelligence",
  description:
    "Bloomberg-grade research terminal for decentralized AI infrastructure: Bittensor, open-source AI, GPU supply, and power.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jbMono.variable} ${fraunces.variable} ${geist.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink-1">
        {children}
      </body>
    </html>
  );
}
