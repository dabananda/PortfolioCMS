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
      <body className='min-h-screen flex flex-col'>{children}</body>
    </html>
  );
}
