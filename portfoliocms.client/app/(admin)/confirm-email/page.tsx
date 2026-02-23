'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const userId = searchParams.get('userid');
    const token = searchParams.get('token');

    if (!userId || !token) {
      setStatus('error');
      setMessage('Invalid confirmation link.');
      return;
    }

    const confirmEmail = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email`);
        url.searchParams.set('userId', userId);
        url.searchParams.set('token', token);

        const res = await fetch(url.toString(), {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error('Failed to confirm email. The link might be expired.');
        }

        setStatus('success');
        setMessage('Your email has been successfully confirmed!');

        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className='max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200 text-center'>
      <h2 className='text-2xl font-bold mb-6'>Email Verification</h2>

      {status === 'loading' && <p className='text-slate-600 animate-pulse'>{message}</p>}

      {status === 'success' && (
        <div className='text-green-600'>
          <p className='mb-4 font-medium'>{message}</p>
          <p className='text-sm text-slate-500'>Redirecting to login...</p>
        </div>
      )}

      {status === 'error' && (
        <div className='text-red-600'>
          <p className='mb-4'>{message}</p>
          <Link
            href='/login'
            className='text-blue-600 hover:underline'
          >
            Return to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <Suspense fallback={<div className='text-slate-500'>Loading verification...</div>}>
        <ConfirmEmailContent />
      </Suspense>
    </div>
  );
}
