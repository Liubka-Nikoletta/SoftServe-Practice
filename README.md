# 🎬 Кіноафіша — React + Vite

Цей застосунок створено в рамках практики **SoftServe Practice: WebUI/React**.  
Він дозволяє переглядати фільми, шукати сеанси, керувати улюбленими.

## 🔧 Реалізовані функції

### 🏠 Головна сторінка
- Перелік актуальних фільмів з постерами, рейтингами та коротким описом.
- Кнопка для перегляду детальної інформації.

### 📄 Сторінка фільму
- Повна інформація про фільм: постер, опис, жанр, рейтинг, рік, трейлер, актори.
- Додавання фільму до «Обраного».

### 🔍 Пошук фільмів
- Пошук за назвою та фільтрація за жанром, роком або рейтингом.

### 🎟️ Сеанси
- Розклад сеансів з можливістю фільтрації за часом, датою, жанром.

### ❤️ Обране
- Відображення збережених фільмів (через localStorage).

### 🔐 Персоналізація
- Реєстрація та вхід користувача.

### 🛠️ Панель адміністратора
- Додавання, редагування, видалення фільмів і сеансів.
- Зміна цін на квитки.

---

## 🧰 Технології

- [React](https://react.dev/) `^19`
- [Vite](https://vitejs.dev/) `^6`
- [React Router DOM](https://reactrouter.com/) `^7`
- [React Toastify](https://fkhadra.github.io/react-toastify/) `^11`
- [Font Awesome](https://fontawesome.com/) — іконки
- [UUID](https://www.npmjs.com/package/uuid) — генерація унікальних ID
- LocalStorage — зберігання даних
- CSS Modules — стилізація
- ESLint — контроль якості коду

---

## 📦 Сценарії запуску

Встановіть залежності:

```bash
npm install
```

Запуск у режимі розробки:

```bash
npm run dev
```

📝 Примітки
Уся інформація про користувачів зберігається в localStorage.

Фільми, сеанси та обране — теж локальні дані або JSON-заготовки.

Проєкт реалізовано без підключення до backend API.


