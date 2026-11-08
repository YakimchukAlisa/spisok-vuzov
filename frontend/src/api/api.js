import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ==========================================
// Вузы
// ==========================================

// Получить список всех вузов
export async function getVuzList() {
  const response = await api.get('/vuz');
  return response.data;
}

// Получить один вуз по ID
export async function getVuzById(id) {
  const response = await api.get(`/vuz/${id}`);
  return response.data;
}

// Получить доп. возможности вуза
export async function getVozmozhnosti(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/vozmozhnosti`);
  return response.data;
}

// ==========================================
// Направления и Профили
// ==========================================

// Направления конкретного вуза
export async function getNapravleniya(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/napravleniya`);
  return response.data;
}

// Профили конкретного направления
export async function getProfili(napravlenieId) {
  const response = await api.get(`/napravlenie/${napravlenieId}/profili`);
  return response.data;
}

// ==========================================
// Профессии
// ==========================================
export async function getProfessions() {
  const response = await api.get('/professions');
  return response.data;
}

export async function getProfessionById(id) {
  const response = await api.get(`/professions/${id}`);
  return response.data;
}

// ==========================================
// Сферы
// ==========================================
export async function getSpheres() {
  const response = await api.get('/spheres');
  return response.data;
}

export async function getSpheresWithCounts() {
  const response = await api.get('/spheres/with-counts');
  return response.data;
}

export async function getSphereById(id) {
  const response = await api.get(`/spheres/${id}`);
  return response.data;
}

export async function getNapravleniyaBySphere(sphereId) {
  const response = await api.get(`/napravleniya/by-sphere/${sphereId}`);
  return response.data;
}

export async function getProfessionsBySphere(sphereId) {
  const response = await api.get(`/spheres/${sphereId}/professions`);
  return response.data;
}
// ==========================================
// Тест на профориентацию
// ==========================================
export async function getTestQuestions() {
  const response = await api.get('/test/questions');
  return response.data;
}

// Сохранить результат теста
export async function saveTestResult(userId, sphereIds) {
  const response = await api.post('/test/result', { userId, sphereIds });
  return response.data;
}

// Информация о поступлении (бюджет/платно) для профиля
export async function getPostInfo(profileId) {
  const response = await api.get(`/profil/${profileId}/post_info`);
  return response.data;
}

// Предметы (ЕГЭ) для конкретного поступления
export async function getExamsForPostInfo(postInfoId) {
  const response = await api.get(`/post_info/${postInfoId}/exams`);
  return response.data;
}

// ==========================================
// Справочники для фильтров на главной
// ==========================================

// Получить список всех городов (для фильтра)
export async function getGoroda() {
  const response = await api.get('/vuz/goroda');
  return response.data;
}

export async function getFakultety(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/fakultety`);
  return response.data;
}

// Получить список всех направлений (специальностей)
export async function getNapravleniyaList() {
  const response = await api.get('/napravleniya');
  return response.data;
}

// Получить список всех экзаменов (ЕГЭ)
export async function getExams() {
  const response = await api.get('/exams/ege');
  return response.data;
}

export async function getVuzCards() {
  const response = await api.get('/vuz/cards');
  return response.data;
}

