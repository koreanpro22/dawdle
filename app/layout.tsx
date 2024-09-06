import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dawdle",
  description: "Connect, plan and experience. All in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>{children}</body>
      <GoogleAnalytics gaId="G-9SCM6QGGS1" />
    </html>
  );
}
