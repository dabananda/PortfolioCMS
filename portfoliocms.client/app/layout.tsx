import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dabananda Mitra | Software Engineer',
  description:
    'Fullstack Software Engineer, specialized in C#, ASP.NET Core, React, NextJs and SQL Server',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className='min-h-screen flex flex-col'>{children}</body>
    </html>
  );
}
