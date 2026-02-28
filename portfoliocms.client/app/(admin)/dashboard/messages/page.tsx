'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  Mail, MailOpen, Trash2, Check, AlertCircle, Loader2,
  Search, X, User, Clock, RefreshCw, Inbox, ChevronLeft, ChevronRight
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type ContactMessage = {
  id: string; fullName: string; email: string;
  subject: string; description: string;
  isRead: boolean; readAt?: string; createdAt: string;
};

type PagedResponse = {
  items: ContactMessage[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  unreadCount: number;
};

type Toast = { type: 'success' | 'error'; msg: string } | null;

function ToastMsg({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium
      ${toast.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' : 'bg-rose-500/15 border-rose-500/25 text-rose-300'}`}>
      {toast.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
      {toast.msg}
    </div>
  );
}

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatFull = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function MessagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const PAGE_SIZE = 15;

  const { data, isLoading, refetch, isFetching } = useQuery<PagedResponse>({
    queryKey: ['messages', page, filterRead],
    queryFn: async () => {
      const params = new URLSearchParams({
        Page: String(page),
        PageSize: String(PAGE_SIZE),
      });
      if (filterRead === 'unread') params.set('IsRead', 'false');
      if (filterRead === 'read') params.set('IsRead', 'true');
      const res = await fetchWithAuth(`contactmessage?${params}`);
      const json = await res.json();
      return json.data ?? json;
    },
    refetchInterval: 60000,
  });

  const messages = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const unreadCount = data?.unreadCount ?? 0;

  const filtered = messages.filter(m =>
    !search ||
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const markRead = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`contactmessage/${id}/mark-as-read`, 'PATCH'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] });
      qc.invalidateQueries({ queryKey: ['messages-count'] });
      if (selected) setSelected(prev => prev ? { ...prev, isRead: true } : null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`contactmessage/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] });
      qc.invalidateQueries({ queryKey: ['messages-count'] });
      setSelected(null);
      setDeleteConfirmOpen(false);
      setToast({ type: 'success', msg: 'Message deleted.' });
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete message.' }),
  });

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) markRead.mutate(msg.id);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />

      <DeleteConfirmModal
        open={deleteConfirmOpen}
        title="Delete Message?"
        itemName={selected?.subject}
        isPending={deleteMutation.isPending}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
        onClose={() => setDeleteConfirmOpen(false)}
      />

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Mail size={20} className="text-violet-400" /> Messages
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {data?.totalCount ?? 0} total · {unreadCount} unread
          </p>
        </div>
        <button onClick={() => refetch()} disabled={isFetching}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 bg-white/4 hover:bg-white/6 border border-white/8 transition-all disabled:opacity-50">
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 flex-1 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>

        {/* Left panel — message list */}
        <div className="w-full max-w-sm flex flex-col bg-[#161b22] border border-white/6 rounded-xl overflow-hidden shrink-0">
          {/* Search + filter */}
          <div className="p-3 border-b border-white/5 space-y-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/4 border border-white/8 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-violet-500/40 transition-all"
                placeholder="Search messages…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex bg-white/4 border border-white/6 rounded-lg p-0.5">
              {(['all', 'unread', 'read'] as const).map(f => (
                <button key={f} onClick={() => { setFilterRead(f); setPage(1); }}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all ${
                    filterRead === f ? 'bg-violet-600 text-white' : 'text-white/35 hover:text-white/60'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-4 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-white/8 shrink-0" />
                  <div className="flex-1 space-y-1.5 py-0.5">
                    <div className="h-3.5 bg-white/8 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Inbox size={32} className="text-white/10 mb-2" />
                <p className="text-sm text-white/30">
                  {search ? 'No results found' : 'No messages yet'}
                </p>
              </div>
            ) : (
              filtered.map((msg, i) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-white/3 ${
                    selected?.id === msg.id ? 'bg-violet-500/8 border-l-2 border-l-violet-500' : ''
                  } ${!msg.isRead ? 'bg-white/[0.02]' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                    {getInitials(msg.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-white/90' : 'font-medium text-white/60'}`}>
                        {msg.fullName}
                      </span>
                      <span className="text-[10px] text-white/25 shrink-0">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${!msg.isRead ? 'text-white/70' : 'text-white/35'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-white/25 truncate mt-0.5">{msg.description}</p>
                    {!msg.isRead && (
                      <span className="inline-block mt-1 w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 shrink-0">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs text-white/30">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Right panel — message detail */}
        <div className="flex-1 bg-[#161b22] border border-white/6 rounded-xl overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
                <Mail size={26} className="text-white/15" />
              </div>
              <p className="text-base font-semibold text-white/30">Select a message</p>
              <p className="text-sm text-white/20 mt-1">Click any message from the list to read it</p>
            </div>
          ) : (
            <>
              {/* Detail header */}
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/5 shrink-0">
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_COLORS[messages.findIndex(m => m.id === selected.id) % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                    {getInitials(selected.fullName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white/90 truncate">{selected.fullName}</h3>
                    <a href={`mailto:${selected.email}`} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">{selected.email}</a>
                    <p className="text-xs text-white/25 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {formatFull(selected.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {selected.isRead ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                      <MailOpen size={10} /> Read
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-full">
                      <Mail size={10} /> Unread
                    </span>
                  )}
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors disabled:opacity-50"
                    title="Delete message"
                  >
                    {deleteMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="px-6 py-4 border-b border-white/5 shrink-0">
                <p className="text-xs font-semibold text-white/25 uppercase tracking-wide mb-1">Subject</p>
                <h2 className="text-lg font-bold text-white/90">{selected.subject}</h2>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="bg-white/2 border border-white/6 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <User size={13} className="text-white/30" />
                    <span className="text-xs text-white/30">Message from <span className="text-white/60">{selected.fullName}</span></span>
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>
              </div>

              {/* Reply action */}
              <div className="px-6 py-4 border-t border-white/5 shrink-0">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-[0.98]"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
