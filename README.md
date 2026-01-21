# 🎓 Advisor Booking System – Backend

This is the backend for the **University Advisor Booking System**.  
It provides a simple REST API that allows students to book advising appointments and advisors to manage their time slots and appointments.

The backend is built following **instructor guidelines**:
- Simple structure
- Clear REST APIs
- No over-engineering
- Easy to understand and explain

---

## ⚙️ Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- bcrypt
- dotenv
- cors

---

## 📁 Project Structure
```
advisor-booking-backend/
├── controllers/
│   ├── authController.js
│   ├── slotController.js
│   ├── appointmentController.js
│   └── userController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── slotRoutes.js
│   ├── appointmentRoutes.js
│   └── userRoutes.js
│
├── db.js
├── server.js
├── .env
├── .gitignore
└── package.json
```
🗄️ Database
The backend uses PostgreSQL with the following tables:

- users (students and advisors)

- advisor_slots

- appointments

Database connection is handled using a single DATABASE_URL environment variable.

🔐 Environment Configuration
Create a .env file in the project root:
```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/advisor_booking
```

🚀 Installation & Run
1️⃣ Install dependencies
```
npm install
```
2️⃣ Start the server
```
npm start
```
The server will run on:
```
http://localhost:5000
```
🌐 API Endpoints
🔑 Authentication
- POST /auth/register – Register student or advisor
- POST /auth/login – Login user

👨‍🏫 Advisors
- GET /users/advisors – Get all advisors (for dropdown/filter)

⏱️ Advisor Slots
- GET /slots – Get available slots
-- Optional query params: advisorId, date
- POST /slots – Create a new slot (advisor)
- DELETE /slots/:id – Delete slot (only if Available)

📅 Appointments
- POST /appointments – Book appointment (student)
- GET /appointments/student/:id – Student appointments
- GET /appointments/advisor/:id – Advisor appointments
- PUT /appointments/:id/complete – Mark appointment as Completed
- PUT /appointments/:id/cancel – Cancel appointment

🧪 Testing
All endpoints were tested using Postman after completing the backend implementation.

Testing covered:

- User registration and login
- Slot creation and deletion
- Appointment booking
- Completing and canceling appointments
- Filtering and listing data
