'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be atleast 8 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const responseData = await res.json();
      const token = responseData.data?.token || responseData.token;

      document.cookie = `accessToken=${token}; path=/; max-age=86400; secure; samesite=strict`;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100'>
      <div className='max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200'>
        <h2 className='text-2xl font-bold text-center mb-6'>Admin Login</h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center'>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
            <input
              {...register('email')}
              type='email'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='admin@example.com'
            />
            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
            <input
              {...register('password')}
              type='password'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='••••••••'
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors'
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
