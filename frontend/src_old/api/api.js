import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Получить список всех вузов
export async function getVuzList() {
  const response = await api.get('/vuz');
  return response.data;
}

// Получить один вуз
export async function getVuzById(id) {
  const response = await api.get(`/vuz/${id}`);
  return response.data;
}

// Направления вуза
export async function getNapravleniya(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/napravleniya`);
  return response.data;
}