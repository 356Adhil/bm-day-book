import localFont from "next/font/local";
import "./globals.css";

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

// Metadata for the document
export const metadata = {
  title: "BM Day Book",
  description: "Bm Day Book is a sales amd expense tracking app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Link to the manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Optional: Add other meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add any additional meta tags or links as needed */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
