# Student Crash Course

Ushbu loyiha talabalarni boshqarish uchun full-stack ilova bo‘lib, **client (React + TypeScript + Vite)** va **server (Node.js + Express + MongoDB)** qismlaridan iborat.

## Loyiha imkoniyatlari

- Parol orqali tizimga kirish (JWT token bilan)
- Talabalar ro‘yxatini ko‘rish
- Yangi talaba qo‘shish
- Talabani o‘chirish
- Sana bo‘yicha davomatni belgilash
- Sana bo‘yicha vazifa holatini yangilash
- Talaba tarixini modal oynada ko‘rish
- Kunlik statistika (kelgan/kelmagan, vazifa holati)
- Dark mode

## Repozitoriya tuzilmasi

```bash
student-crash-course/
├── client/   # Frontend (React)
└── server/   # Backend (Express + MongoDB)
```

---

## Client qismi (Frontend)

Client qismi `client/` papkada joylashgan.

### Texnologiyalar

- React 19
- TypeScript
- Vite
- ESLint
- SweetAlert2

### Asosiy fayllar

- `client/src/App.tsx` — token bor/yo‘qligiga qarab Login yoki Dashboard ko‘rsatadi
- `client/src/components/Dashboard.tsx` — umumiy dashboard, tema boshqaruvi
- `client/src/components/StudentManager.tsx` — asosiy biznes logika (API chaqiruvlari, CRUD, davomat/vazifa)
- `client/src/components/StudentTable.tsx` — talabalar jadvali
- `client/src/components/StudentModal.tsx` — talaba tarixi oynasi
- `client/src/components/Statistics.tsx` — statistika kartalari
- `client/src/components/StudentToolbar.tsx` — sana, qo‘shish formasi
- `client/src/interfaces/student.interface.ts` — Student va History tiplari

### API bilan ishlashi

Client `VITE_API_URL` orqali serverga murojaat qiladi:

- Talabalar uchun endpointlar: `${VITE_API_URL}/students`
- Har bir so‘rovga `Authorization: ****** yuboriladi
- 401 holatda token o‘chirilib logout qilinadi

### Clientni ishga tushirish

```bash
cd client
npm install
npm run dev
```

Qo‘shimcha buyruqlar:

```bash
npm run build
npm run lint
npm run preview
```

---

## Server qismi (Backend)

Server qismi `server/` papkada joylashgan.

### Texnologiyalar

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `dotenv`
- `cors`

### Asosiy fayllar

- `server/server.js` — app bootstrap, middleware, route ulash, DB connect
- `server/routes/auth.routes.js` — auth route
- `server/routes/student.routes.js` — student route va auth middleware
- `server/controllers/auth.controller.js` — login va token berish
- `server/controllers/student.controller.js` — student CRUD + PATCH logikasi
- `server/middleware/auth.middleware.js` — ****** tekshiruvi
- `server/models/Student.js` — Student schema va history schema

### Ma’lumot modeli

`Student` modeli:

- `fullName` (String, required)
- `course` (Number, required)
- `history` (array)

`history` elementi:

- `date` (String, required, format tavsiya: `YYYY-MM-DD`)
- `attendance` (Boolean, default: `false`)
- `taskStatus` (enum):
  - `bajarilgan`
  - `toliq bajarilmagan`
  - `bajarilmagan`

### Authentication

Login endpoint:

- `POST /api/auth/login`

Body:

```json
{
  "password": "your_password"
}
```

To‘g‘ri parolda server 7 kunlik JWT token qaytaradi.

### Student API endpointlari

Barchasi auth talab qiladi (`Authorization: ******

- `GET /api/students` — barcha talabalar
- `GET /api/students/:id` — bitta talaba
- `POST /api/students` — talaba yaratish
- `PUT /api/students/:id` — talaba ma’lumotini to‘liq yangilash
- `PATCH /api/students/:id` — sana bo‘yicha `attendance`/`taskStatus` yangilash
- `DELETE /api/students/:id` — talaba o‘chirish

PATCH body misoli:

```json
{
  "date": "2026-09-06",
  "attendance": true,
  "taskStatus": "bajarilgan"
}
```

### Server `.env` sozlamalari

`server/.env` fayl yarating:

```env
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/student_crash_course
JWT_SECRET=your_jwt_secret
APP_PASSWORD_HASH=your_bcrypt_hash
```

`APP_PASSWORD_HASH` olish uchun (oddiy usul):

```bash
cd server
node -e "require('bcryptjs').hash('123456', 10).then(console.log)"
```

Chiqqan hash qiymatini `.env` ichiga qo‘ying.

### Serverni ishga tushirish

```bash
cd server
npm install
npm run dev
```

Yoki production:

```bash
npm start
```

---

## To‘liq ishga tushirish tartibi

1. MongoDB ishga tushiring
2. `server/.env` ni to‘ldiring
3. Serverni ishga tushiring (`server` papkada)
4. Clientni ishga tushiring (`client` papkada)
5. Clientda login qilib tizimdan foydalaning

---

## Eslatma

Client kodi `Login` komponentini `./pages/Login` dan import qiladi va `StudentManager` ichida ham `../pages/*` import yo‘llari mavjud. Agar sizda bu fayllar mavjud bo‘lmasa, import path’larni amaldagi joylashuvga moslab tekshiring.
