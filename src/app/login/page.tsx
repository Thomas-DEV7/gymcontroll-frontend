'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-2xl bg-purple-800 p-10 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          GymControll
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500 bg-opacity-20 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-lg border border-gray-600 bg-black text-white px-4 py-3 placeholder-gray-500 focus:border-purple-400 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-lg border border-gray-600 bg-black text-white px-4 py-3 placeholder-gray-500 focus:border-purple-400 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-3 rounded-lg"
            >
              Sign In
            </button>

            <Link href="/register">
              <button
                type="button"
                className="w-full border border-purple-400 text-purple-200 hover:bg-purple-700 hover:text-white transition font-semibold py-3 rounded-lg"
              >
                Create an Account
              </button>
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by GymControll © 2025
        </p>
      </div>
    </main>
  );
}
