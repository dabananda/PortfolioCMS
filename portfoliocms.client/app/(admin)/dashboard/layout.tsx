'use client';

import { useSidebarStore } from '../../../store/useSidebarStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import QueryProvider from '@/providers/QueryProvider';
import {
  LayoutDashboard,
  User,
  Code2,
  FolderOpen,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Plus,
  Menu,
  X,
  ChevronRight,
  Home,
  GraduationCap,
  BriefcaseBusiness,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Experience', href: '/dashboard/work-experience', icon: BriefcaseBusiness },
  { label: 'Skills', href: '/dashboard/skills', icon: Code2 },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { label: 'Education', href: '/dashboard/education', icon: GraduationCap },
  { label: 'Blog', href: '/dashboard/blog', icon: BookOpen },
];

const SETTINGS_ITEMS = [{ label: 'General', href: '/dashboard/settings', icon: Settings }];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = 'accessToken=; path=/; max-age=0';
    router.push('/login');
  };

  // Build breadcrumb from pathname
  const crumbs = pathname.split('/').filter(Boolean);

  return (
    <>
      {/* Google Font — DM Sans */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');`}</style>

      <div
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className='flex h-screen bg-[#0d1117] text-white overflow-hidden'
      >
        {/* Sidebar */}
        <aside
          className={`
            relative flex flex-col shrink-0
            bg-[#161b22] border-r border-white/6
            transition-all duration-300 ease-in-out
            ${isOpen ? 'w-55' : 'w-16'}
          `}
        >
          {/* Logo */}
          <div className='flex items-center gap-3 px-4 h-16 border-b border-white/6 shrink-0'>
            <div className='w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20'>
              <span className='text-[11px] font-bold tracking-tight'>PC</span>
            </div>
            {isOpen && (
              <div className='overflow-hidden'>
                <p className='text-sm font-semibold text-white leading-tight whitespace-nowrap'>
                  PortfolioCMS
                </p>
                <p className='text-[10px] text-white/35 whitespace-nowrap'>v1.0.0</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className='flex-1 py-4 px-2 space-y-0.5 overflow-y-none'>
            {isOpen && (
              <p className='text-[10px] font-semibold text-white/25 tracking-[0.12em] uppercase px-2 pb-2.5'>
                Menu
              </p>
            )}

            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3 px-2 py-2.5 rounded-lg
                    transition-all duration-150 group relative
                    ${
                      active
                        ? 'bg-violet-500/12 text-violet-400'
                        : 'text-white/45 hover:text-white/80 hover:bg-white/4'
                    }
                  `}
                >
                  <Icon
                    size={16}
                    className='shrink-0'
                  />
                  {isOpen && (
                    <>
                      <span className='text-sm font-medium whitespace-nowrap flex-1'>{label}</span>
                      {active && (
                        <ChevronRight
                          size={12}
                          className='opacity-50'
                        />
                      )}
                    </>
                  )}
                  {/* Tooltip when collapsed */}
                  {!isOpen && (
                    <span
                      className='
                      absolute left-full ml-3 px-2.5 py-1.5 bg-[#21262d] text-white text-xs
                      rounded-md whitespace-nowrap opacity-0 pointer-events-none
                      group-hover:opacity-100 transition-opacity z-50 border border-white/8
                      shadow-xl
                    '
                    >
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className='pt-5'>
              {isOpen && (
                <p className='text-[10px] font-semibold text-white/25 tracking-[0.12em] uppercase px-2 pb-2.5'>
                  Settings
                </p>
              )}

              {SETTINGS_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      flex items-center gap-3 px-2 py-2.5 rounded-lg
                      transition-all duration-150 group relative
                      ${
                        active
                          ? 'bg-violet-500/12 text-violet-400'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/4'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      className='shrink-0'
                    />
                    {isOpen && (
                      <span className='text-sm font-medium whitespace-nowrap'>{label}</span>
                    )}
                    {!isOpen && (
                      <span className='absolute left-full ml-3 px-2.5 py-1.5 bg-[#21262d] text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/8 shadow-xl'>
                        {label}
                      </span>
                    )}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-white/45 hover:text-red-400 hover:bg-red-500/[0.07] transition-all duration-150 group relative'
              >
                <LogOut
                  size={16}
                  className='shrink-0'
                />
                {isOpen && <span className='text-sm font-medium whitespace-nowrap'>Logout</span>}
                {!isOpen && (
                  <span className='absolute left-full ml-3 px-2.5 py-1.5 bg-[#21262d] text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/8 shadow-xl'>
                    Logout
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* User profile */}
          <div className='border-t border-white/6 p-3 shrink-0'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 text-[11px] font-bold text-white shadow-md'>
                AD
              </div>
              {isOpen && (
                <div className='overflow-hidden'>
                  <p className='text-sm font-semibold text-white/90 leading-tight whitespace-nowrap'>
                    Alex Dev
                  </p>
                  <p className='text-[11px] text-white/35 whitespace-nowrap'>
                    {localStorage.getItem('email')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main area */}
        <main className='flex-1 flex flex-col overflow-hidden'>
          {/* Topbar */}
          <header className='flex items-center justify-between px-6 h-16 bg-[#161b22] border-b border-white/6 shrink-0'>
            {/* Left: toggle + breadcrumb */}
            <div className='flex items-center gap-4'>
              <button
                onClick={toggleSidebar}
                className='p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/6 transition-all'
                aria-label='Toggle sidebar'
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <nav className='flex items-center gap-1.5 text-sm'>
                <Link
                  href='/dashboard'
                  className='text-white/30 hover:text-white/60 transition-colors'
                >
                  <Home size={14} />
                </Link>
                {crumbs.map((crumb, i) => (
                  <span
                    key={i}
                    className='flex items-center gap-1.5'
                  >
                    <span className='text-white/15'>/</span>
                    <span
                      className={
                        i === crumbs.length - 1
                          ? 'text-white/80 font-medium capitalize'
                          : 'text-white/35 capitalize'
                      }
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            </div>

            {/* Right: bell + CTA */}
            <div className='flex items-center gap-3'>
              <button className='relative p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/6 transition-all'>
                <Bell size={18} />
                <span className='absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-[#161b22]' />
              </button>

              <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/25 active:scale-95'>
                <Plus size={15} />
                New Project
              </button>
            </div>
          </header>

          {/* Page content */}
          <div className='flex-1 overflow-auto p-6 bg-[#0d1117]'>
            <QueryProvider>{children}</QueryProvider>
          </div>
        </main>
      </div>
    </>
  );
}
