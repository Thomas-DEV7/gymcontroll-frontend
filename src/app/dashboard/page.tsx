'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // ou um loading spinner
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Olá, {user.name}!</h1>
      <p className="text-gray-600 mb-8">Seja bem-vindo ao GymControll!</p>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </main>
  );
}
