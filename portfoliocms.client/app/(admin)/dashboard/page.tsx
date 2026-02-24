'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import {
  FolderOpen,
  FileText,
  GraduationCap,
  Mail,
  Eye,
  Reply,
  Archive,
  FilePlus,
  FolderPlus,
  UserCog,
  Wrench,
  BriefcaseBusiness,
} from 'lucide-react';

type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type ApiBlogPost = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
};

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-cyan-500',
];

const getInitials = (name: string) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return mins + 'm ago';
  if (hours < 24) return hours + 'h ago';
  if (days < 7) return days + 'd ago';
  return new Date(iso).toLocaleDateString();
};

const BLOG_POST_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-indigo-700',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-sky-600',
];

const QUICK_ACTIONS = [
  { label: 'Write New Post', icon: FilePlus, href: '/dashboard/blog/new' },
  { label: 'Add Project', icon: FolderPlus, href: '/dashboard/projects/new' },
  { label: 'Update Profile', icon: UserCog, href: '/dashboard/profile' },
  { label: 'Site Config', icon: Wrench, href: '/dashboard/settings' },
];

const STATUS_STYLES: Record<'Published' | 'Draft', string> = {
  Published: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  Draft: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
};

const fetchCount = async (endpoint: string): Promise<number> => {
  const res = await fetchWithAuth(endpoint);
  const json = await res.json();
  const data = json.data ?? json;
  if (Array.isArray(data)) return data.length;
  if (typeof data === 'number') return data;
  if (typeof data?.totalCount === 'number') return data.totalCount;
  if (typeof data?.total === 'number') return data.total;
  if (typeof data?.count === 'number') return data.count;
  if (Array.isArray(data?.items)) return data.items.length;
  return 0;
};

const fetchMessages = async (): Promise<ContactMessage[]> => {
  const res = await fetchWithAuth('contactmessage?Page=1&PageSize=4');
  const json = await res.json();
  const data = json.data ?? json;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

const fetchRecentBlogPosts = async (): Promise<ApiBlogPost[]> => {
  const res = await fetchWithAuth('blogpost?Page=1&PageSize=4');
  const json = await res.json();
  const data = json.data ?? json;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

export default function DashboardPage() {
  const { data: projectCount = 0, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects-count'],
    queryFn: () => fetchCount('project'),
  });

  const { data: blogCount = 0, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs-count'],
    queryFn: () => fetchCount('blogpost'),
  });

  const { data: messageCount = 0, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages-count'],
    queryFn: () => fetchCount('contactmessage'),
  });

  const { data: messages = [], isLoading: messagesListLoading } = useQuery({
    queryKey: ['messages-list'],
    queryFn: fetchMessages,
  });

  const { data: skillsCount = 0, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills-count'],
    queryFn: () => fetchCount('skill'),
  });

  const { data: experiencesCount = 0, isLoading: experiencesLoading } = useQuery({
    queryKey: ['experiences-count'],
    queryFn: () => fetchCount('workexperience'),
  });

  const { data: recentBlogPosts = [], isLoading: blogPostsLoading } = useQuery({
    queryKey: ['recent-blog-posts'],
    queryFn: fetchRecentBlogPosts,
  });

  const recentMessages = messages.slice(0, 5);

  const allStats = [
    {
      label: 'Total Projects',
      value: projectsLoading ? null : String(projectCount),
      icon: FolderOpen,
      iconColor: 'text-blue-400',
    },
    {
      label: 'Published Posts',
      value: blogsLoading ? null : String(blogCount),
      icon: FileText,
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Messages',
      value: messagesLoading ? null : String(messageCount),
      icon: Mail,
      iconColor: 'text-red-400',
    },
    {
      label: 'Total Skills',
      value: skillsLoading ? null : String(skillsCount),
      icon: GraduationCap,
      iconColor: 'text-violet-400',
    },
    {
      label: 'Experiences',
      value: experiencesLoading ? null : String(experiencesCount),
      icon: BriefcaseBusiness,
      iconColor: 'text-amber-400',
    },
    {
      label: 'Profile Views',
      value: '1.2k',
      icon: Eye,
      iconColor: 'text-cyan-400',
    },
  ];

  return (
    <div className='space-y-5'>
      {/* Stat Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3'>
        {allStats.map(({ label, value, icon: Icon, iconColor }) => (
          <div
            key={label}
            className='bg-[#161b22] border border-white/6 rounded-xl p-4 flex flex-col gap-3 hover:border-white/12 transition-colors duration-200'
          >
            <div className='flex items-center justify-between'>
              <span className='text-[11px] font-medium text-white/35 leading-tight'>{label}</span>
              <Icon
                size={15}
                className={'shrink-0 ' + iconColor}
              />
            </div>
            <div>
              {value === null ? (
                <div className='h-8 w-12 bg-white/6 rounded-md animate-pulse' />
              ) : (
                <p className='text-2xl font-bold text-white leading-none tracking-tight'>{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className='grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5'>
        {/* Left column */}
        <div className='space-y-5'>
          {/* Recent Contact Messages */}
          <div className='bg-[#161b22] border border-white/6 rounded-xl overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-white/5'>
              <h2 className='text-sm font-semibold text-white/90'>Recent Contact Messages</h2>
              <button className='text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors'>
                View All
              </button>
            </div>

            <table className='w-full'>
              <thead>
                <tr className='border-b border-white/4'>
                  {['Name', 'Subject', 'Date', 'Action'].map((h) => (
                    <th
                      key={h}
                      className='text-left text-[10px] font-semibold text-white/20 tracking-widest uppercase px-5 py-3'
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messagesListLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr
                      key={i}
                      className='border-b border-white/4'
                    >
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td
                          key={j}
                          className='px-5 py-4'
                        >
                          <div className='h-4 bg-white/6 rounded animate-pulse' />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentMessages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-5 py-8 text-center text-sm text-white/30'
                    >
                      No messages yet.
                    </td>
                  </tr>
                ) : (
                  recentMessages.map((msg, i) => (
                    <tr
                      key={msg.id}
                      className={
                        'hover:bg-white/2 transition-colors ' +
                        (i !== recentMessages.length - 1 ? 'border-b border-white/4 ' : '') +
                        (!msg.isRead ? 'bg-violet-500/3' : '')
                      }
                    >
                      <td className='px-5 py-3.5'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={
                              'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ' +
                              AVATAR_COLORS[i % AVATAR_COLORS.length]
                            }
                          >
                            {getInitials(msg.fullName)}
                          </div>
                          <div className='min-w-0'>
                            <span className='text-sm font-medium text-white/75 block truncate'>
                              {msg.fullName}
                            </span>
                            {!msg.isRead && (
                              <span className='text-[10px] text-violet-400 font-medium'>
                                Unread
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-5 py-3.5 text-sm text-white/45 max-w-45'>
                        <span className='truncate block'>{msg.subject}</span>
                      </td>
                      <td className='px-5 py-3.5 text-sm text-white/30 whitespace-nowrap'>
                        {timeAgo(msg.createdAt)}
                      </td>
                      <td className='px-5 py-3.5'>
                        <div className='flex items-center gap-1.5'>
                          <button
                            title='Reply'
                            className='p-1.5 rounded-md text-white/25 hover:text-white/70 hover:bg-white/6 transition-all'
                          >
                            <Reply size={13} />
                          </button>
                          <button
                            title='Archive'
                            className='p-1.5 rounded-md text-white/25 hover:text-white/70 hover:bg-white/6 transition-all'
                          >
                            <Archive size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div className='bg-[#161b22] border border-white/6 rounded-xl p-5'>
            <h2 className='text-sm font-semibold text-white/90 mb-4'>Quick Actions</h2>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className='flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/[0.07] bg-white/2 hover:bg-white/5 hover:border-white/13 text-white/50 hover:text-white/90 transition-all duration-150 text-sm font-medium'
                >
                  <Icon
                    size={14}
                    className='shrink-0 text-violet-400'
                  />
                  <span className='whitespace-nowrap'>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Recent Blog Posts */}
        <div className='bg-[#161b22] border border-white/6 rounded-xl overflow-hidden flex flex-col'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-white/5'>
            <h2 className='text-sm font-semibold text-white/90'>Recent Blog Posts</h2>
            <button className='text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors'>
              Manage
            </button>
          </div>

          <div className='flex-1 divide-y divide-white/4'>
            {blogPostsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='flex items-start gap-3.5 px-5 py-4'
                >
                  <div className='w-11 h-11 rounded-lg bg-white/6 shrink-0 animate-pulse' />
                  <div className='flex-1 space-y-2 pt-1'>
                    <div className='h-3.5 bg-white/6 rounded animate-pulse w-full' />
                    <div className='h-3.5 bg-white/6 rounded animate-pulse w-3/4' />
                    <div className='flex gap-2 pt-0.5'>
                      <div className='h-4 w-16 bg-white/6 rounded-full animate-pulse' />
                      <div className='h-4 w-12 bg-white/6 rounded animate-pulse' />
                    </div>
                  </div>
                </div>
              ))
            ) : recentBlogPosts.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 px-5 text-center'>
                <FileText
                  size={28}
                  className='text-white/10 mb-2'
                />
                <p className='text-sm text-white/30'>No blog posts yet.</p>
                <a
                  href='/dashboard/blog/new'
                  className='text-xs text-violet-400 hover:text-violet-300 mt-1 transition-colors'
                >
                  Write your first post →
                </a>
              </div>
            ) : (
              recentBlogPosts.map((post, i) => {
                const status = post.isPublished ? 'Published' : 'Draft';
                const dateStr =
                  post.isPublished && post.publishedAt
                    ? timeAgo(post.publishedAt)
                    : timeAgo(post.createdAt);
                const gradient = BLOG_POST_GRADIENTS[i % BLOG_POST_GRADIENTS.length];
                return (
                  <div
                    key={post.id}
                    className='flex items-start gap-3.5 px-5 py-4 hover:bg-white/2 transition-colors'
                  >
                    {post.imageUrl && post.imageUrl.includes('example.com') ? (
                      <div className={'w-11 h-11 rounded-lg bg-linear-to-br ' + gradient} />
                    ) : post.imageUrl ? (
                      <div className='relative w-11 h-11 rounded-lg overflow-hidden'>
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                    ) : (
                      <div className={'w-11 h-11 rounded-lg bg-linear-to-br ' + gradient} />
                    )}
                    <div
                      className={
                        'w-11 h-11 rounded-lg bg-linear-to-br shrink-0 mt-0.5 ' +
                        gradient +
                        (post.imageUrl ? ' hidden' : '')
                      }
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-white/75 leading-snug line-clamp-2'>
                        {post.title}
                      </p>
                      <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                        <span
                          className={
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full ' +
                            STATUS_STYLES[status]
                          }
                        >
                          {status}
                        </span>
                        <span className='text-[11px] text-white/25'>{dateStr}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className='px-5 py-3.5 border-t border-white/5'>
            <button className='text-sm text-white/30 hover:text-white/60 transition-colors'>
              {'View all ' + (blogsLoading ? '...' : blogCount) + ' posts →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
