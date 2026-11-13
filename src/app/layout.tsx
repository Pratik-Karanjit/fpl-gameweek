import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FPL Gameweek",
  description:
    "Dynamic Fantasy Premier League mini-league analytics and live gameweek rankings.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-slate-100 min-h-screen flex flex-col selection:bg-emerald-400 selection:text-slate-900">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(55,0,60,0.5),rgba(255,255,255,0))] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,rgba(0,255,135,0.04),rgba(0,0,0,0))] pointer-events-none -z-10" />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}

