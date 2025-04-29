'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    getTrainingByUuid,
    getExercisesByTraining,
    createExercise,
    updateExercise,
    deleteExercise
} from '@/services/trainings';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface Training {
    uuid: string;
    name: string;
    created_at: string;
}

interface Exercise {
    uuid: string;
    name: string;
}

export default function ShowTrainingPage() {
    const { uuid } = useParams();
    const [training, setTraining] = useState<Training | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    const [newExerciseName, setNewExerciseName] = useState('');
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trainingRes, exercisesRes] = await Promise.all([
                    getTrainingByUuid(uuid as string),
                    getExercisesByTraining(uuid as string),
                ]);

                setTraining(trainingRes.data.data);
                setExercises(exercisesRes.data.data);
            } catch (error) {
                toast.error('Failed to load training or exercises');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uuid]);

    const handleCreate = async () => {
        if (!newExerciseName.trim()) return;

        try {
            const response = await createExercise(uuid as string, { name: newExerciseName });
            setExercises((prev) => [...prev, response.data.data]);
            setNewExerciseName('');
            setShowCreateModal(false);
            toast.success('Exercise created');
        } catch (err) {
            toast.error('Error creating exercise');
        }
    };

    const handleUpdate = async () => {
        if (!editingExercise) return;
        try {
            await updateExercise(uuid as string, editingExercise.uuid, { name: editingExercise.name });
            setExercises((prev) =>
                prev.map((e) => (e.uuid === editingExercise.uuid ? { ...e, name: editingExercise.name } : e))
            );
            setEditingExercise(null);
            setShowEditModal(false);
            toast.success('Exercise updated');
        } catch (err) {
            toast.error('Error updating exercise');
        }
    };

    const handleDelete = async () => {
        if (!deleteExerciseId) return;
        try {
            await deleteExercise(uuid as string, deleteExerciseId);
            setExercises((prev) => prev.filter((e) => e.uuid !== deleteExerciseId));
            setDeleteExerciseId(null);
            setShowDeleteModal(false);
            toast.success('Exercise deleted');
        } catch (err) {
            toast.error('Error deleting exercise');
        }
    };

    if (loading) return <p className="text-gray-300">Loading...</p>;
    if (!training) return <p className="text-red-400">Training not found.</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">{training.name}</h1>
            <p className="text-sm text-gray-400 mb-6">
                Created on: {new Date(training.created_at).toLocaleString('pt-BR')}
            </p>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl text-purple-400 font-semibold">Exercises</h2>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
                    >
                        + Add Exercise
                    </button>
                </div>


                {exercises.length === 0 ? (
                    <p className="text-gray-400">No exercises found for this training.</p>
                ) : (
                    <ul className="space-y-4">
                        {exercises.map((exercise) => (
                            <li
                                key={exercise.uuid}
                                className="p-4 bg-gray-800 rounded-lg text-white flex justify-between items-center"
                            >
                                <span>{exercise.name}</span>

                                <div className="space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingExercise({ ...exercise });
                                            setShowEditModal(true);
                                        }}
                                        className="text-blue-400 hover:text-blue-600"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDeleteExerciseId(exercise.uuid);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-400 hover:text-red-600"
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
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl text-white mb-4">Add Exercise</h3>
                        <input
                            value={newExerciseName}
                            onChange={(e) => setNewExerciseName(e.target.value)}
                            placeholder="Exercise name"
                            className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded text-white"
                        />
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                                Cancel
                            </button>
                            <button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingExercise && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl text-white mb-4">Edit Exercise</h3>
                        <input
                            value={editingExercise.name}
                            onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                            placeholder="Exercise name"
                            className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded text-white"
                        />
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm text-white">
                        <p className="mb-4">Are you sure you want to delete this exercise?</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-white">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
