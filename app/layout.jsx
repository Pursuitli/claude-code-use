import './globals.css';

export const metadata = {
  title: 'Love Island',
  description: 'A polished low-poly 3D browser game built with Three.js.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Noto+Serif+TC:wght@300;400;600;900&family=Ma+Shan+Zheng&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL@20..48,400..700,1"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
