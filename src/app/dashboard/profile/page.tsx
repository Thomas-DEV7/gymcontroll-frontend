'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/services/auth';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Dados adicionais
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');

  // Preenche dados quando o user estiver disponível
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      // Campos adicionais caso venham do backend no futuro
      // setPhone(user.phone || '')
      // setBirthdate(user.birthdate || '')
      // setAddress(user.address || '')
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({ name, phone, birthdate, address });
      // await refreshUser();
      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil', error);
      toast.error('Falha ao atualizar perfil');
    }
  };

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-gray-900 p-6 rounded-lg space-y-6">
        {/* Foto de perfil */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 flex justify-center items-center w-full h-full">No photo</span>
            )}
          </div>

          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-sm text-gray-300"
            />
          )}
        </div>

        {/* Dados principais */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400">Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              />
            ) : (
              <p className="text-lg">{name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400">Email</label>
            <p className="text-lg text-gray-500">{email}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              />
            ) : (
              <p className="text-lg">{phone || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400">Birthdate</label>
            {editing ? (
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              />
            ) : (
              <p className="text-lg">{birthdate || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400">Address</label>
            {editing ? (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              />
            ) : (
              <p className="text-lg">{address || '-'}</p>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-4">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
