import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dabananda Mitra | Software Engineer',
  description:
    'Fullstack Software Engineer, specialized in C#, ASP.NET Core, React, NextJs and SQL Server',
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className='min-h-screen flex flex-col bg-slate-50 text-slate-900'>
        <nav className='p-4 bg-white shadow-sm font-bold text-xl'>My Portfolio</nav>

        <main className='grow p-8'>{children}</main>

        <footer className='p-4 bg-slate-900 text-white text-center'>
          © {new Date().getFullYear()}{' '}
          <a
            href='https://github.com/dabananda'
            target='_blank'
          >
            Dabananda Mitra
          </a>
        </footer>
      </body>
    </html>
  );
}
