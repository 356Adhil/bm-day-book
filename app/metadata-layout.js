// app/metadata-layout.js
export const metadata = {
  title: "BM Day Book",
  description: "BM Day Book is a sales and expense tracking app",
};

export default function MetadataLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/compass-regular.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/compass-regular.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add any additional meta tags or links as needed */}
      </head>
      <body>{children}</body>
    </html>
  );
}
