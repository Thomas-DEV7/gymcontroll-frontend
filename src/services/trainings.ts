import api from './api';

export async function getTrainings() {
  return api.get('/trainings');
}

export async function createTraining(data: { name: string }) {
  return api.post('/trainings', data);
}

export async function getTrainingByUuid(uuid: string) {
  return api.get(`/trainings/${uuid}`);
}

export async function getExercisesByTraining(training_uuid: string) {
  return api.get(`/trainings/${training_uuid}/exercises`);
}


export async function createExercise(training_uuid: string, data: { name: string }) {
  return api.post(`/trainings/${training_uuid}/exercises`, data);
}

export async function updateExercise(training_uuid: string, exercise_uuid: string, data: { name: string }) {
  return api.put(`/trainings/${training_uuid}/exercises/${exercise_uuid}`, data);
}

export async function deleteExercise(training_uuid: string, exercise_uuid: string) {
  return api.delete(`/trainings/${training_uuid}/exercises/${exercise_uuid}`);
}


export const updateTraining = (uuid: string, data: { name: string }) =>
  api.put(`/trainings/${uuid}`, data);

export const deleteTraining = (uuid: string) =>
  api.delete(`/trainings/${uuid}`);
