import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welcome 10th Batch - University Welcome Portal",
  description: "Welcome to the family! Interactive portal for new students with quiz, Q&A, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
