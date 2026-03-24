import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
        <div className="flex-1 border-x border-outline-variant/20 max-w-7xl mx-auto w-full relative">
          {children}
        </div>
      </body>
    </html>
  );
}
