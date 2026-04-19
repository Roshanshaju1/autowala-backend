# 🚗 AutoWala - Auto Booking App

A full-stack auto-rickshaw booking app built with React + Node.js + MySQL.

---

## 📁 Project Structure

```
autowala-project/
├── autowala-backend/     ← Node.js + Express API
└── autowala-frontend/    ← React App
```

---

## 🛠️ Setup Instructions

### Step 1: Setup MySQL Database

1. Open **MySQL Workbench**
2. Open the file: `autowala-backend/config/setup.sql`
3. Run it — this creates the database, tables, and sample drivers

---

### Step 2: Setup Backend

```bash
cd autowala-backend
npm install
```

Then open `.env` and update your MySQL password:
```
DB_PASSWORD=your_actual_mysql_password
```

Start the backend:
```bash
npm run dev
```

✅ Backend runs on: http://localhost:5000

---

### Step 3: Setup Frontend

Open a **new terminal**:

```bash
cd autowala-frontend
npm install
npm start
```

✅ Frontend runs on: http://localhost:3000

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile (auth required) |
| POST | /api/trip/book | Book a trip (auth required) |
| GET | /api/trip/history | Trip history (auth required) |
| PATCH | /api/trip/cancel/:id | Cancel a trip (auth required) |

---

## 📱 App Pages

- **/** → Landing page (Login / Register buttons)
- **/register** → User registration
- **/login** → User login
- **/home** → Home with offers & quick actions
- **/trip** → Book auto + Trip history
- **/profile** → User profile + logout

---

## 🔐 Authentication

- Passwords are hashed with **bcryptjs**
- Auth uses **JWT tokens** (stored in localStorage)
- Protected routes require `Authorization: Bearer <token>` header

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express |
| Database | MySQL 8 |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io (ready to use) |
| HTTP | Axios |

---

## 💡 Next Steps (Advanced)

- [ ] Google Maps API for real pickup/drop location
- [ ] Socket.io real-time chat between user & driver
- [ ] Live driver location tracking
- [ ] UPI payment integration
- [ ] WhatsApp OTP login
- [ ] Driver app (separate frontend)
- [ ] Admin dashboard

---

Made with ❤️ in Kerala 🌴
