import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import Side from "./Components/Side";
import Navbar from "./Components/Navbar";

// Font configuration should be at the top
const inter = Inter({ subsets: ["latin"] });

// Metadata configuration should be at the top
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Single definition of RootLayout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Side />
          <Navbar/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}