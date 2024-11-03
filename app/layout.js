// app/layout.js
"use client";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import useServiceWorker from "./hooks/useServiceWorker";
import MetadataLayout from "./metadata-layout"; // Import the new layout
import OnlineSync from "./services/OnlineSync";

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

export default function RootLayout({ children }) {
  useServiceWorker();
  return (
    <MetadataLayout>
      <Providers>
        <OnlineSync /> 
        <>{children}</>
      </Providers>
    </MetadataLayout>
  );
}
