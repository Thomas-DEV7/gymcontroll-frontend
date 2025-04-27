'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <p className="text-gray-300">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-red-400">User not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

      <div className="space-y-4 text-white">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UUID:</strong> {user.uuid}</p>
      </div>
    </div>
  );
}
