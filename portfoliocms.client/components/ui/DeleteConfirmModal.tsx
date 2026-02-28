'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  open,
  title = 'Delete Item?',
  description,
  itemName,
  isPending = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: animating ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0)',
        backdropFilter: animating ? 'blur(4px)' : 'blur(0px)',
        transition: 'background-color 250ms ease, backdrop-filter 250ms ease',
      }}
      onClick={() => !isPending && onClose()}
    >
      <div
        className="bg-[#161b22] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        style={{
          transform: animating ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          opacity: animating ? 1 : 0,
          transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold text-white/90 mb-1">{title}</h3>
        <p className="text-sm text-white/40 mb-5">
          {description
            ? description
            : itemName
            ? <>
                <span className="text-white/60 font-medium">"{itemName}"</span>
                {' '}will be permanently deleted and cannot be recovered.
              </>
            : 'This action cannot be undone.'}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white/50 bg-white/5 hover:bg-white/8 border border-white/6 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
