'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      setSuccessMsg('Registration successful! Please check your email to confirm your account.');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <div className='max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200'>
        <h2 className='text-2xl font-bold text-center mb-6'>Create an Account</h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center'>
            {error}
          </div>
        )}

        {successMsg && (
          <div className='mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center'>
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>First Name</label>
              <input
                {...register('firstName')}
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              />
              {errors.firstName && (
                <p className='text-red-500 text-xs mt-1'>{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Last Name</label>
              <input
                {...register('lastName')}
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
              />
              {errors.lastName && (
                <p className='text-red-500 text-xs mt-1'>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Username</label>
            <input
              {...register('username')}
              type='text'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            />
            {errors.username && (
              <p className='text-red-500 text-xs mt-1'>{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
            <input
              {...register('email')}
              type='email'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            />
            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
            <input
              {...register('password')}
              type='password'
              className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Confirm Password
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
            disabled={isLoading}
            className='w-full py-2 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors'
          >
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className='mt-6 text-center text-sm text-slate-600'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-blue-600 hover:underline'
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
