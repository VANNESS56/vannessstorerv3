import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  title: "VANNESS STORE - Jual Nomor Virtual Murah & Terbaik Nomor 1 di Indonesia",
  description: "Solusi verifikasi OTP cepat, murah, dan bergaransi untuk berbagai aplikasi (WhatsApp, Telegram, Google, dll). Tersedia nomor dari 50+ negara.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
