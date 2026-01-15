import type { Metadata } from "next";
import { Inter, Lato, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
  variable: "--font-source-sans"
});
const lato = Lato({ 
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato"
});

export const metadata: Metadata = {
  title: "Interview.ai",
  description: "AI-powered Interviews",
  openGraph: {
    title: "Interview.ai",
    description: "AI-powered Interviews",
    siteName: "Interview.ai",
    images: [
      {
        url: "/interviewai.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/browser-client-icon.ico" />
      </head>
      <body className={`${inter.className} ${sourceSans.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}
