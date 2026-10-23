import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamShield AI — Pause. Analyze. Protect.",
  description: "An AI-powered digital payment safety assistant that explains suspicious message warning signs.",
  themeColor: "#FFFFFF"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="light"><body>{children}</body></html>;
}
