// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import AppShell from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "SYNC — Carbon-Aware Orchestration for AI Compute",
  description: "Powered by Digital Energy Grid · Beckn Protocol · Multi-Agent AI",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
