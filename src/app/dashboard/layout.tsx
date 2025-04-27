'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoadingUser(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading user...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`bg-black text-white p-6 transition-all duration-300 ${menuOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
          {menuOpen && (
            <h2 className="text-2xl font-bold text-purple-400">GymControll</h2>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-purple-400 hover:text-purple-600 transition"
          >
            {menuOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="flex-1 space-y-6">
          <Link href="/dashboard" className={`block ${pathname === '/dashboard' ? 'text-purple-400' : 'hover:text-purple-400'} transition`}>
            {menuOpen ? 'Trainings' : '🏋️'}
          </Link>
          <Link href="/dashboard/profile" className={`block ${pathname === '/dashboard/profile' ? 'text-purple-400' : 'hover:text-purple-400'} transition`}>
            {menuOpen ? 'Profile' : '👤'}
          </Link>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-black p-4 shadow-md">
          <div />
          <div className="flex items-center space-x-4">
            <span className="text-white">{user?.name ?? 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
