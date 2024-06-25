import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import TRPCProvider from "@/providers/tRPC.provider";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={cn("relative h-full font-sans antialiased", inter.className)}
      >
        <main className="relative flex min-h-screen flex-col">
          <TRPCProvider>
            <Navbar />
            <div className="flex-1 flex-grow">{children}</div>
            <Footer />
          </TRPCProvider>
        </main>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
