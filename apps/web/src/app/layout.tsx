import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOBA AGENT - AI Command Center",
  description: "Personal AI Command Center. Control your entire digital ecosystem through natural language.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
