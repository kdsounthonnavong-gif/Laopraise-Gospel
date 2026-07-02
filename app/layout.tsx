import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-lao",
  display: "swap",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Laopraise Gospel",
  description: "ຄັງເພງ Gospel — Gospel Song Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansLao.variable} antialiased min-h-screen bg-[#F8FAFB]`}>
        {children}
      </body>
    </html>
  );
}
