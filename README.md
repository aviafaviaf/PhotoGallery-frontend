# Photo Gallery - Frontend

Веб-приложение для просмотра и управления фотогалереей. Фронтенд часть проекта, взаимодействующая с бэкенд API.

## Основные технологии
- React
- TypeScript
- Tailwind CSS
- Axios для API запросов

## Требования
- Node.js
- npm
- Работающий бэкенд сервер

## Установка и запуск

1. Клонировать репозиторий:
`git clone https://github.com/aviafaviaf/PhotoGallery-frontend.git`
`cd PhotoGallery-frontend`

2. Установить зависимости:
`npm install`

3. Настроить переменные окружения (создать файл .env в корне проекта):
`REACT_APP_API_URL=https://photogallery-backend-2s77.onrender.com/api`

4. Запустить dev-сервер:
`npm run dev`

Приложение будет доступно по адресу: http://localhost:3000

## Сборка
`npm run build`

### Docker-сборка:
1. Соберите образ: `docker build -t photo-gallery-frontend .`
2. Запустите контейнер: `docker run -p 3000:80 photo-gallery-frontend`

## Основные функции
- Регистрация и авторизация пользователей
- Просмотр публичных фотографий
- Загрузка новых фотографий
- Управление своими фотографиями (удаление, публикация/снятие с публикации)
- Просмотр фотографий других пользователей
- Добавление/удаление фотографий в избранное
- Просмотр избранных фотографий
- Добавление комментариев к фотографиям

## Структура проекта
```
PHOTO-GALLERY/
├── build/ # Собранный проект (после npm run build)
├── public/ # Статические файлы
│ ├── favicon.ico
│ ├── index.html
│ ├── logo192.png
│ ├── logo512.png
│ ├── manifest.json
│ └── robots.txt
├── src/ # Исходный код
│ ├── api/
│ │ └── api.ts
│ ├── pages/ # Страницы приложения
│ │ ├── Favorites.tsx # Страница избранного
│ │ ├── Home.tsx # Домашняя страница
│ │ ├── Login.tsx # Страница входа
│ │ ├── Navigation.tsx # Навигация
│ │ ├── PhotoDetail.tsx # Детали фотографии
│ │ ├── ProtectedRoute.tsx # Защищенные маршруты
│ │ ├── Register.tsx # Страница регистрации
│ │ ├── UserGallery.tsx # Галерея пользователя
│ │ └── UserPage.tsx # Страница пользователя
│ ├── App.css # Глобальные стили
│ ├── App.test.tsx
│ ├── App.tsx # Главный компонент
│ ├── index.css # Основные стили
│ ├── index.tsx # Точка входа
│ ├── logo.svg
│ ├── react-app-env.d.ts
│ ├── reportWebVitals.ts
│ └── setupTests.ts
├── .gitignore
├── Dockerfile # Конфигурация Docker
├── package-lock.json
├── package.json
├── postcss.config.js # Конфигурация PostCSS
├── README.md
├── tailwind.config.js # Конфигурация Tailwind CSS
└── tsconfig.json # Конфигурация TypeScript
```
