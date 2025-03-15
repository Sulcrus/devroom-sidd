import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Siddhartha Bank - BankSmartXP",
  description: "Your trusted banking partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster 
            richColors 
            position="top-right"
            theme="system"
            closeButton
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
