import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Material Hub IITM",
    template: "%s · Material Hub IITM",
  },
  description:
    "Organize IITM BS Data Science study resources beautifully. Course notes, PDFs, Drive links and YouTube — all in one calm, modern hub.",
  keywords: ["IITM", "BS Data Science", "study materials", "notes", "PYQs"],
  authors: [{ name: "Material Hub IITM" }],
  openGraph: {
    title: "Material Hub IITM",
    description:
      "Organize IITM BS Data Science study resources beautifully.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <div className="bg-ambient pointer-events-none fixed inset-0 -z-10" />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern [background-size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
            <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-muted-foreground md:px-8">
              Material Hub IITM · Built with Next.js
            </footer>
          </div>
        </div>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            classNames: {
              toast:
                "!bg-card/90 !border-white/10 !text-foreground !backdrop-blur-xl",
            },
          }}
        />
      </body>
    </html>
  );
}
