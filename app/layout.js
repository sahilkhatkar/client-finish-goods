import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
// import GlobalWrapper from "./components/GlobalDataLoader";
import StoreProvider from "./StoreProvider";
import ThemeProvider from "./ThemeProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider>
            <SessionProvider>
              <StoreProvider>
                {/* <GlobalWrapper> */}
                {children}
                {/* </GlobalWrapper> */}
              </StoreProvider>
            </SessionProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
