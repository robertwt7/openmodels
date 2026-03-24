import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenModels | The Kinetic Mainframe",
  description: "Directory for open source AI models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${publicSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-primary selection:text-on-primary">
        <div className="flex-1 border-x border-outline-variant/20 max-w-[1440px] mx-auto w-full relative grid grid-cols-12 min-h-screen bg-surface">
          <Sidebar />
          <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col relative h-screen overflow-y-auto">
            <div className="p-8 lg:p-12 xl:p-16 flex flex-col gap-12 w-full max-w-5xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}