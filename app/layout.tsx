import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeaveFusion AI",
  description:
    "An AI-driven generative sandbox blending Indian handloom heritage with Western fashion silhouettes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
