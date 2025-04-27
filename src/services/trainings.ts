import api from './api';

export async function getTrainings() {
  const response = await api.get('/trainings');
  return response.data;
}
