'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTrainings } from '@/services/trainings';

interface Training {
  uuid: string;
  name: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await getTrainings();
        setTrainings(response.data);
      } catch (error) {
        console.error('Failed to fetch trainings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Loading trainings...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user?.name} 👋</h1>

      <section>
        <h2 className="text-2xl font-semibold text-purple-400 mb-4">Your Trainings</h2>

        {trainings.length === 0 ? (
          <p className="text-gray-400">No trainings found.</p>
        ) : (
          <ul className="space-y-4">
            {trainings.map((training) => (
              <li key={training.uuid} className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
                {training.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
