'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid reset link. Missing email or token.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const payload = {
        email,
        token,
        newPassword: data.newPassword,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = 'Failed to reset password. The link might be expired.';
        try {
          const responseData = await res.json();
          errorMsg = responseData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      setStatus('success');
      setMessage('Your password has been successfully reset!');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  // If the URL is completely broken, don't even show the form
  if (!email || !token) {
    return (
      <div className='text-center p-8'>
        <h2 className='text-2xl font-bold text-red-600 mb-4'>Invalid Link</h2>
        <p className='text-slate-600 mb-4'>This password reset link is invalid or incomplete.</p>
        <Link
          href='/forgot-password'
          className='text-blue-600 hover:underline'
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className='text-2xl font-bold text-center mb-2'>Create New Password</h2>
      <p className='text-center text-slate-500 mb-6 text-sm'>Enter your new password below.</p>

      {status === 'success' ? (
        <div className='text-center'>
          <div className='mb-6 p-4 bg-green-50 text-green-700 rounded-md text-sm border border-green-200'>
            {message}
          </div>
          <p className='text-sm text-slate-500'>Redirecting to login...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          {status === 'error' && (
            <div className='p-3 bg-red-100 text-red-700 rounded-md text-sm text-center'>
              {message}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>New Password</label>
            <input
              {...register('newPassword')}
              type='password'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            />
            {errors.newPassword && (
              <p className='text-red-500 text-xs mt-1'>{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Confirm New Password
            </label>
            <input
              {...register('confirmPassword')}
              type='password'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={status === 'loading'}
            className='w-full py-2 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors'
          >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </>
  );
}

// Wrap in Suspense
export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <div className='max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200'>
        <Suspense
          fallback={
            <div className='text-center text-slate-500 animate-pulse'>Loading secure form...</div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
