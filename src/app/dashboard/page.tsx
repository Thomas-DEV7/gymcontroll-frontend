'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTrainings, createTraining, updateTraining, deleteTraining } from '@/services/trainings';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Training {
  uuid: string;
  name: string;
  created_at?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrainingName, setNewTrainingName] = useState('');

  const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
  const [showDeleteTrainingModal, setShowDeleteTrainingModal] = useState(false);
  const [editingTrainingName, setEditingTrainingName] = useState('');

  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [trainingToDelete, setTrainingToDelete] = useState<string | null>(null);

  const handleUpdateTraining = async () => {
    if (!editingTraining) return;
    try {
      await updateTraining(editingTraining.uuid, { name: editingTrainingName });
      setTrainings(prev => prev.map(t => t.uuid === editingTraining.uuid ? { ...t, name: editingTrainingName } : t));
      toast.success('Training updated');
      setShowEditTrainingModal(false);
    } catch (err) {
      toast.error('Error updating training');
    }
  };

  const handleDeleteTraining = async () => {
    if (!trainingToDelete) return;
    try {
      await deleteTraining(trainingToDelete);
      setTrainings(prev => prev.filter(t => t.uuid !== trainingToDelete));
      toast.success('Training deleted');
      setShowDeleteTrainingModal(false);
    } catch (err) {
      toast.error('Error deleting training');
    }
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await getTrainings();
        setTrainings(response.data.data);
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
      setTrainings(prev => [...prev, response.data.data]);
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
      {/* Delete Modal */}
      {showDeleteTrainingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm text-white">
            <p className="mb-4">Are you sure you want to delete this training?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowDeleteTrainingModal(false)} className="text-gray-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleDeleteTraining} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditTrainingModal && editingTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md text-white">
            <h3 className="text-xl mb-4">Edit Training</h3>
            <input
              value={editingTrainingName}
              onChange={(e) => setEditingTrainingName(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowEditTrainingModal(false)} className="text-gray-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleUpdateTraining} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}


      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-purple-400">Your Trainings</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold px-4 py-2 rounded-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Training</span>
          </button>
        </div>

        {trainings.length === 0 ? (
          <p className="text-gray-400">No trainings found.</p>
        ) : (
          <ul className="space-y-4">
            {trainings.map((training) => (
              <li
                key={training.uuid}
                className="p-4 bg-gray-800 rounded-lg shadow-md text-white flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">{training.name}</h2>
                  {training.created_at && (
                    <p className="text-xs text-gray-400">
                      Created on {new Date(training.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    href={`/dashboard/trainings/${training.uuid}`}
                    className="text-purple-400 hover:text-purple-600"
                    title="View Training"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => {
                      setEditingTraining(training);
                      setEditingTrainingName(training.name);
                      setShowEditTrainingModal(true);
                    }}
                    className="text-blue-400 hover:text-blue-600"
                    title="Edit Training"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setTrainingToDelete(training.uuid);
                      setShowDeleteTrainingModal(true);
                    }}
                    className="text-red-400 hover:text-red-600"
                    title="Delete Training"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Create Modal */}
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
