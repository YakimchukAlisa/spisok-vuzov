// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8080/api/vuz', () => {
    return HttpResponse.json([
      { id: 1, name: 'АлтГТУ', abbreviatura: 'АлтГТУ', gorod: 'Барнаул' }
    ]);
  }),

  http.get('http://localhost:8080/api/napravlenie/:id/profili', ({ params }) => {
    return HttpResponse.json([
      { id: 1, name: 'Программно-техническое обеспечение АС', forma: 'Очная' }
    ]);
  }),
];