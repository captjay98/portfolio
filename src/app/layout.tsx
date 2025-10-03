import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";

const inter = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jamal Ibrahim Umar | Software Engineer",
  description: "Portfolio of Jamal Ibrahim Umar, Fullstack Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}  font-sans overflow-hidden bg-light-background dark:bg-dark-background text-light dark:text-dark`}
      >
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="mt-20 animate-fade-in">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
