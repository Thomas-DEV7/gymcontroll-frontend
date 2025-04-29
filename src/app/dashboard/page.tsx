'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTrainings, createTraining } from '@/services/trainings';
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';

interface Training {
  uuid: string;
  name: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrainingName, setNewTrainingName] = useState('');

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await getTrainings();
        setTrainings(response.data.data); // <-- aqui, pegar o array correto
      } catch (error) {
        console.error('Failed to fetch trainings', error);
      } finally {
        setLoading(false);
      }
    };


    fetchTrainings();
  }, []);

  const handleAddTraining = async () => {
    if (!newTrainingName.trim()) return;

    try {
      const response = await createTraining({ name: newTrainingName });
      setTrainings((prev) => [...prev, response.data.data]); // <-- pegar o .data também na criação
      setNewTrainingName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create training', error);
    }
  };


  if (loading) {
    return <p className="text-gray-300">Loading trainings...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Training</span>
        </button>

      </div>

      <section>
        <h2 className="text-2xl font-semibold text-purple-400 mb-4">Your Trainings</h2>

        {trainings.length === 0 ? (
          <p className="text-gray-400">No trainings found.</p>
        ) : (
          <ul className="space-y-4">
            {trainings.map((training) => (
              <li key={training.uuid} className="p-4 bg-gray-800 rounded-lg shadow-md text-white flex justify-between items-center">
                <span>{training.name}</span>
                <Link href={`/dashboard/trainings/${training.uuid}`} className="text-purple-400 hover:text-purple-600">
                  <Eye className="w-5 h-5" />
                </Link>
              </li>
            ))}
          </ul>

        )}
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-2xl text-white font-bold mb-6">Create New Training</h3>
            <input
              type="text"
              value={newTrainingName}
              onChange={(e) => setNewTrainingName(e.target.value)}
              placeholder="Enter training name"
              className="w-full rounded-md border border-gray-600 bg-black text-white px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTraining}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
