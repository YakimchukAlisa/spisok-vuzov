# API контракт — Справочник вузов

Base URL httplocalhost8080api

## GET vuz
Список всех вузов.

Response 200
[
  {
    id 1,
    name Алтайский государственный технический университет,
    abbreviatura АлтГТУ,
    site httpswww.altstu.ru,
    email pk@altgtu.ru,
    phone +7 (3852) 29-07-29,
    gorod Барнаул,
    region Алтайский край
  }
]

## GET vuz{id}
Один вуз.

Response 200 один объект (как выше)
Response 404 { error Вуз не найден }

## GET vuz{id}napravleniya
Направления вуза.

Response 200
[
  {
    id 1,
    kod 09.03.01,
    name Информатика и вычислительная техника,
    fakultet Факультет информационных технологий,
    uroven Бакалавриат
  }
]

## GET napravlenie{id}profili
Профили направления.

Response 200
[
  {
    id 1,
    name Программно-техническое обеспечение автоматизированных систем,
    forma Очная,
    srok_obuch_mes 48,
    uroven Бакалавриат
  }
]

## GET profil{id}post_info
Условия приёма по профилю.

Response 200
[
  {
    id 1,
    god 2026,
    osnovanie Бюджетная основа,
    kol_mest 52,
    stoimost 0,
    prohodnoi 185
  }
]

## POST calculator
Калькулятор ЕГЭ.

Request
{
  scores {
    russian 50,
    math 100,
    physics 100
  }
}

Response 200
[
  {
    vuz АлтГТУ,
    kod 09.03.01,
    napravlenie Информатика и вычислительная техника,
    profil Программно-техническое обеспечение АС,
    forma Очная,
    osnovanie Бюджетная основа,
    prohodnoi 185,
    summa_abiturienta 250,
    zapas 65
  }
]