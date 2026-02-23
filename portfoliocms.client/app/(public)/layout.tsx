export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
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
    </>
  );
}
