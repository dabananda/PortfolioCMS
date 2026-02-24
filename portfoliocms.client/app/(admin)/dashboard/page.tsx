'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderGit2, FileText, Mail } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

const fetchStats = async (endpoint: string): Promise<number> => {
  const res = await fetchWithAuth(endpoint);
  const json = await res.json();
  const dataArray = json.data ?? json;
  return Array.isArray(dataArray) ? dataArray.length : 0;
};

export default function DashboardPage() {
  const { data: projectCount = 0, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects-count'],
    queryFn: () => fetchStats('project'),
  });

  const { data: blogCount = 0, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs-count'],
    queryFn: () => fetchStats('blogpost'),
  });

  const { data: messageCount = 0, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages-count'],
    queryFn: () => fetchStats('contactmessage'),
  });

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900'>Dashboard Overview</h1>
        <p className='text-slate-500 mt-2'>
          Welcome back! Here is what's happening in your Portfolio CMS today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-3'>
        {/* Projects Card */}
        <Card className='shadow-sm border-slate-200'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-semibold text-slate-600'>Total Projects</CardTitle>
            <FolderGit2 className='h-5 w-5 text-slate-400' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-slate-900'>
              {projectsLoading ? (
                <span className='animate-pulse text-slate-300'>...</span>
              ) : (
                projectCount
              )}
            </div>
            <p className='text-xs text-slate-500 mt-1'>Live in your portfolio</p>
          </CardContent>
        </Card>

        {/* Blogs Card */}
        <Card className='shadow-sm border-slate-200'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-semibold text-slate-600'>Published Blogs</CardTitle>
            <FileText className='h-5 w-5 text-slate-400' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-slate-900'>
              {blogsLoading ? <span className='animate-pulse text-slate-300'>...</span> : blogCount}
            </div>
            <p className='text-xs text-slate-500 mt-1'>Articles written</p>
          </CardContent>
        </Card>

        {/* Messages Card */}
        <Card className='shadow-sm border-slate-200 border-l-4 border-l-blue-500'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-semibold text-slate-600'>Contact Messages</CardTitle>
            <Mail className='h-5 w-5 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-blue-600'>
              {messagesLoading ? (
                <span className='animate-pulse text-blue-300'>...</span>
              ) : (
                messageCount
              )}
            </div>
            <p className='text-xs text-slate-500 mt-1'>Received from visitors</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Panel */}
      <div className='mt-8'>
        <Card className='bg-slate-50 border-dashed border-2 border-slate-200 shadow-none'>
          <CardContent className='p-6 text-center text-slate-500'>
            <p className='font-medium text-slate-700 mb-1'>TanStack Query is active!</p>
            <p className='text-sm'>
              If you navigate to another page and come back, this dashboard will load instantly from
              the cache while fetching updates in the background.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
