import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    template: '%s | Siddhartha Bank',
    default: 'Siddhartha Bank - Modern Banking Solutions',
  },
  description: "Experience modern banking with Siddhartha Bank",
  keywords: ['banking', 'finance', 'money transfer', 'online banking'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}