import type { Metadata } from "next";
import { Sidebar } from "@/components/shell/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synthesise — Turn your knowledge into a digital product",
  description:
    "Scan the market for a profitable niche, write the lead magnet, and render the cover.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
