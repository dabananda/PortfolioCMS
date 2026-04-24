'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  Star, Plus, Pencil, Trash2, X, Check, AlertCircle,
  Loader2, UserCircle2, Briefcase,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type Review = {
  id: string;
  name: string;
  designation?: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
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

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110">
          <Star size={22}
            className={`transition-colors ${star <= (hovered || value) ? 'text-amber-400' : 'text-white/15'}`}
            fill={star <= (hovered || value) ? 'currentColor' : 'none'}
          />
        </button>
      ))}
      <span className="text-sm text-white/40 ml-2">{value}/5</span>
    </div>
  );
}

type FormState = { name: string; designation: string; rating: number; comment: string };
const defaultForm: FormState = { name: '', designation: '', rating: 5, comment: '' };

function ReviewModal({ open, review, onClose, onSaved }: {
  open: boolean; review?: Review; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState('');
  const isEdit = !!review;

  useEffect(() => {
    if (open) {
      setForm(review ? {
        name: review.name,
        designation: review.designation ?? '',
        rating: review.rating,
        comment: review.comment,
      } : defaultForm);
      setError('');
    }
  }, [open, review]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        designation: form.designation || undefined,
        rating: form.rating,
        comment: form.comment,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`review/${review!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('review', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      onSaved(isEdit ? 'Review updated!' : 'Review added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all';
  const isValid = form.name && form.comment && form.comment.length >= 10 && form.rating >= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Review' : 'Add Review'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Reviewer Name *</label>
            <div className="relative">
              <UserCircle2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="e.g. John Smith"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Designation</label>
            <div className="relative">
              <Briefcase size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="e.g. CTO at TechCorp"
                value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 block">Rating *</label>
            <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Comment *</label>
            <textarea rows={4} className={inputCls + ' resize-none'}
              placeholder="Write the testimonial here... (min. 10 characters)"
              value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
            <p className="text-xs text-white/25 mt-1 text-right">{form.comment.length} / 1000</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isValid}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={12}
          className={s <= rating ? 'text-amber-400' : 'text-white/10'}
          fill={s <= rating ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

const AVATAR_COLORS = [
  'from-violet-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
];

export default function ReviewsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; review?: Review }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await fetchWithAuth('review');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`review/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      setToast({ type: 'success', msg: 'Review deleted.' });
      setDeleteTarget(null);
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete.' }),
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />
      <ReviewModal open={modal.open} review={modal.review}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Review?"
        itemName={deleteTarget?.name}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Star size={20} className="text-violet-400" /> Reviews
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} · avg {avgRating} ★
          </p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Review
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 animate-pulse">
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map(j => <div key={j} className="w-3 h-3 rounded-full bg-white/8" />)}
              </div>
              <div className="h-3 bg-white/5 rounded w-full mb-1.5" />
              <div className="h-3 bg-white/5 rounded w-4/5 mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/8" />
                <div className="space-y-1.5">
                  <div className="h-3 bg-white/8 rounded w-24" />
                  <div className="h-2.5 bg-white/5 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <Star size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No reviews yet</p>
          <p className="text-white/25 text-sm mb-4">Add testimonials from clients and colleagues.</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto">
            <Plus size={14} /> Add Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, idx) => (
            <div key={review.id} className="bg-[#161b22] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <StarDisplay rating={review.rating} />
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ open: true, review })}
                    className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteTarget(review)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/55 leading-relaxed flex-1 line-clamp-4">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} shrink-0`}>
                  {review.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{review.name}</p>
                  {review.designation && (
                    <p className="text-xs text-white/35">{review.designation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
