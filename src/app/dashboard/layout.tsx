'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronLeftCircle, ChevronRight, ChevronRightCircle, Dumbbell, LogOut, User, UserCircle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading user...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`bg-black text-white p-6 transition-all duration-300 ${menuOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
          {menuOpen && <h2 className="text-2xl font-bold text-purple-400">GymControll</h2>}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-purple-400 hover:text-purple-600 transition"
          >
            {menuOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRightCircle className="w-5 h-5" />
            )}          </button>
        </div>

        <nav className="flex-1 space-y-6">
          <Link
            href="/dashboard"
            className={`flex items-center space-x-2 ${pathname === '/dashboard' ? 'text-purple-400' : 'hover:text-purple-400'} transition`}
          >
            <Dumbbell className="w-5 h-5" />
            {menuOpen && <span>Trainings</span>}
          </Link>

          <Link
            href="/dashboard/profile"
            className={`flex items-center space-x-2 ${pathname === '/dashboard/profile' ? 'text-purple-400' : 'hover:text-purple-400'} transition`}
          >
            <User className="w-5 h-5" />
            {menuOpen && <span>Profile</span>}
          </Link>
        </nav>

        <div className="mt-auto text-sm text-gray-400">
          {menuOpen && user && <span>Logged in as<br />{user.name}</span>}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-black p-4 shadow-md">
          <div />
          <div className="flex items-center space-x-4">
            <span className="text-white flex items-center space-x-2">
              <UserCircle className="w-5 h-5" />
              <span>{user?.name?.split(' ')[0] ?? 'User'}</span>
            </span>            <button
              onClick={handleLogout}
              className="text-purple-400 hover:text-purple-600 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 sm:p-8 overflow-auto text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
