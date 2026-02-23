'use client';

import { useSidebarStore } from '../../../store/useSidebarStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();

  const handleLogout = () => {
    // Delete the cookie and kick the user back to login
    document.cookie = 'accessToken=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <div className='flex h-screen bg-slate-100'>
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} flex flex-col`}
      >
        <div className='h-16 px-6 font-bold text-xl border-b border-slate-700 flex justify-between items-center'>
          {isOpen ? <span>CMS Admin</span> : <span>CMS</span>}
        </div>

        <nav className='flex-1 p-4 space-y-2'>
          <Link
            href='/dashboard'
            className='block p-2 rounded hover:bg-slate-800'
          >
            {isOpen ? '🏠 Dashboard' : '🏠'}
          </Link>
        </nav>

        <div className='p-4 border-t border-slate-700'>
          <button
            onClick={handleLogout}
            className='cursor-pointer w-full text-left p-2 rounded hover:bg-red-600 transition-colors'
          >
            {isOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Header */}
        <header className='bg-white shadow-sm px-6 h-16 flex items-center'>
          <button
            onClick={toggleSidebar}
            className='p-2 bg-slate-200 rounded-md hover:bg-slate-300 text-slate-700 font-bold'
          >
            {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
          </button>
        </header>

        {/* Dynamic Page Content */}
        <div className='flex-1 overflow-auto p-8'>{children}</div>
      </main>
    </div>
  );
}
