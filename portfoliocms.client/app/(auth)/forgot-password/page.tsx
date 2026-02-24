'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Something went wrong. Please try again later.');
      }

      setStatus('success');
      setMessage('If an account exists for that email, we have sent password reset instructions.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <div className='max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200'>
        <h2 className='text-2xl font-bold text-center mb-2'>Forgot Password</h2>
        <p className='text-center text-slate-500 mb-6 text-sm'>
          Enter your email address and we will send you a link to reset your password.
        </p>

        {status === 'success' ? (
          <div className='text-center'>
            <div className='mb-6 p-4 bg-green-50 text-green-700 rounded-md text-sm border border-green-200'>
              {message}
            </div>
            <Link
              href='/login'
              className='text-slate-900 font-medium hover:underline'
            >
              Return to Login
            </Link>
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
              <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
              <input
                {...register('email')}
                type='email'
                placeholder='admin@example.com'
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              />
              {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
            </div>

            <button
              type='submit'
              disabled={status === 'loading'}
              className='w-full py-2 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors'
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className='text-center mt-4'>
              <Link
                href='/login'
                className='text-sm text-slate-500 hover:text-slate-900'
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
