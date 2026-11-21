import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ==========================================
// Вузы
// ==========================================

export async function getVuzList() {
  const response = await api.get('/vuz');
  return response.data;
}

export async function getVuzById(id) {
  const response = await api.get(`/vuz/${id}`);
  return response.data;
}

export async function getVozmozhnosti(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/vozmozhnosti`);
  return response.data;
}

// ==========================================
// Направления и Профили
// ==========================================

export async function getNapravleniya(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/napravleniya`);
  return response.data;
}

export async function getProfili(napravlenieId) {
  const response = await api.get(`/napravlenie/${napravlenieId}/profili`);
  return response.data;
}

export async function getNapravlenieDetails(kod) {
  const response = await api.get(`/napravlenie/${kod}/details`);
  return response.data;
}

// ==========================================
// Профессии
// ==========================================

export async function getProfessions() {
  const response = await api.get('/professions');
  return response.data;
}

// ВАЖНО: singular /profession, как в ProfessionController
export async function getProfessionById(id) {
  const response = await api.get(`/profession/${id}`);
  return response.data;
}

// Направления (специальности), связанные с профессией
export async function getNapravleniyaByProfession(professionId) {
  const response = await api.get(`/profession/${professionId}/napravleniya`);
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

export async function saveTestResult(userId, sphereIds) {
  const response = await api.post('/test/result', { userId, sphereIds });
  return response.data;
}

export async function getPostInfo(profileId) {
  const response = await api.get(`/profil/${profileId}/post_info`);
  return response.data;
}

export async function getExamsForPostInfo(postInfoId) {
  const response = await api.get(`/post_info/${postInfoId}/exams`);
  return response.data;
}

// ==========================================
// Справочники для фильтров на главной
// ==========================================

export async function getGoroda() {
  const response = await api.get('/vuz/goroda');
  return response.data;
}

export async function getFakultety(vuzId) {
  const response = await api.get(`/vuz/${vuzId}/fakultety`);
  return response.data;
}

export async function getNapravleniyaList() {
  const response = await api.get('/napravleniya');
  return response.data;
}

export async function getExams() {
  const response = await api.get('/exams/ege');
  return response.data;
}

export async function getVuzCards() {
  const response = await api.get('/vuz/cards');
  return response.data;
}

export async function sendCode(phone) {
  const res = await api.post('/auth/send-code', { phone });
  return res.data;
}

export async function verifyCode(phone, code) {
  const res = await api.post('/auth/verify-code', { phone, code });
  return res.data;
}

export async function registerUser(phone, name, email) {
  const res = await api.post('/auth/register', { phone, name, email });
  return res.data;
}

export async function adminLogin(phone, password) {
  const res = await api.post('/auth/admin-login', { phone, password });
  return res.data;
}

export async function getProfile(phone) {
  const res = await api.get('/auth/profile', { params: { phone } });
  return res.data;
}

export async function updateProfile(data) {
  const res = await api.put('/auth/profile', data);
  return res.data;
}