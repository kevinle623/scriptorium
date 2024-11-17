import type { Metadata } from "next";
import {Manrope} from "next/font/google";
import {Space_Grotesk} from "next/font/google";
import "./globals.css";
import {ReactQueryProvider} from "@client/providers/ReactQueryProvider";
import {ThemeProvider} from "next-themes"
import NavBar from "@client/components/nav-bar/NavBar";
import {customMetaData} from "@client/data/customMetaData";
import {ToasterProvider} from "@client/providers/ToasterProvider";
import {AuthProvider} from "@client/providers/AuthProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: customMetaData.title,
  description: customMetaData.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
          <ReactQueryProvider>
            <ToasterProvider>
              <AuthProvider>
                <NavBar />
                {children}
              </AuthProvider>
            </ToasterProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
