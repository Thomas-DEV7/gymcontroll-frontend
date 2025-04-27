import api from './api';

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const response = await api.post('/login', data);
  return response.data; 
}

export async function me() {
  const response = await api.get('/me');
  return response.data;
}

export async function logout() {
  const response = await api.post('/logout');
  return response.data;
}
