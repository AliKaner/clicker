import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Grid Clicker Game",
  description: "A dynamic grid clicker game with upgradeable buttons, colorable cells, and color fusion mechanics",
  keywords: ["game", "clicker", "grid", "color", "fusion", "incremental"],
  authors: [{ name: "Grid Clicker Game" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#111111",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
