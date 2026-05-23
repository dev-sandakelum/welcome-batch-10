import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

export const metadata: Metadata = {
  title: "Welcome 10th Batch - University Welcome Portal",
  description: "Welcome to the family! Interactive portal for new students with quiz, Q&A, and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}