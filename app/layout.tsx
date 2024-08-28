import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../lib/store/Provider"
import { AuthProvider } from "../lib/context/AuthContext";

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
      <body className={raleway.className}>
      <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
