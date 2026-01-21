# 🎓🧠 Advisor Booking Backend (Express + PostgreSQL)

This is the **backend** for the **University Advisor Booking System**.  
It provides REST APIs for **authentication**, **advisor slots**, and **appointments** (booking, completing, canceling).

---

## 🏗️ Tech Stack

- Node.js + Express
- PostgreSQL (via `pg`)
- `dotenv`, `cors`, `bcrypt`

---

## 🚀 Getting Started

```bash
# 1) Install dependencies
cd advisor-booking-backend
npm install

# 2) Create a PostgreSQL database (example: advisor_booking)

# 3) Create tables (run the SQL in pgAdmin Query Tool)
#    (tables: users, advisor_slots, appointments)

# 4) Create .env file (in project root)
#    Example:
#    PORT=5000
#    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/advisor_booking

# 5) Start the server
npm start
```
The API will run on:
```
http://localhost:5000
```

## 🗂️ Project Structure
```text
advisor-booking-backend/
├── routes/
│   ├── authRoutes.js           # register & login
│   ├── slotRoutes.js           # advisor slots CRUD (simple)
│   ├── appointmentRoutes.js    # booking + status updates
│   └── userRoutes.js           # advisors list
├── controllers/
│   ├── authController.js
│   ├── slotController.js
│   ├── appointmentController.js
│   └── userController.js
├── db.js                       # pg Pool connection (DATABASE_URL)
├── server.js                   # app entry
├── .env                        # environment variables (ignored by git)
├── .gitignore
└── package.json
```
## 🔐 Environment Variables
Create a .env file in the project root:
```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/advisor_booking
```
## 📡 API Endpoints
🔑 Auth Routes

Base URL: /auth
| Method | Endpoint    | Description                           |
| ------ | ----------- | ------------------------------------- |
| POST   | `/register` | Register a new user (student/advisor) |
| POST   | `/login`    | Login user                            |

🔸 POST /auth/register
Registers a new user.
```
{
  "full_name": "Dr. Sara Ahmad",
  "email": "sara@uni.com",
  "password": "12345",
  "role": "advisor"
}
```
🔸 POST /auth/login
Logs in an existing user.
```
{
  "email": "sara@uni.com",
  "password": "12345"
}
```
## 👨‍🏫 Advisors Routes

Base URL: /users
| Method | Endpoint    | Description                            |
| ------ | ----------- | -------------------------------------- |
| GET    | `/advisors` | Get all advisors (for dropdown/filter) |

## ⏱️ Slots Routes

Base URL: /slots
| Method | Endpoint | Description                               |
| ------ | -------- | ----------------------------------------- |
| GET    | `/`      | Get available slots (supports filtering)  |
| POST   | `/`      | Create a slot (advisor)                   |
| DELETE | `/:id`   | Delete slot (only if status is Available) |

🔸 GET /slots (Filters)
Examples:
- /slots
- /slots?advisorId=1
- /slots?date=2026-01-25
- /slots?advisorId=1&date=2026-01-25
Returns only slots with status "Available".

🔸 POST /slots
```
{
  "advisor_id": 1,
  "slot_date": "2026-01-25",
  "slot_time": "10:00",
  "location": "Building A - Office 12"
}
```
## 📅 Appointments Routes

Base URL: /appointments
| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| POST   | `/`             | Book an appointment (student) |
| GET    | `/student/:id`  | Get student appointments      |
| GET    | `/advisor/:id`  | Get advisor appointments      |
| PUT    | `/:id/complete` | Mark appointment as Completed |
| PUT    | `/:id/cancel`   | Cancel appointment            |

🔸 POST /appointments (Book)
```
{
  "slot_id": 1,
  "student_id": 2
}
```
Behavior:
- Slot status becomes "Booked"
- Appointment is created with status "Booked"
- Response includes slot date/time/location (useful for EmailJS in frontend)

🔸 PUT /appointments/:id/complete
Marks a booked appointment as Completed.

🔸 PUT /appointments/:id/cancel
Cancels a booked appointment:

- Appointment status becomes "Canceled"
  
- Slot status returns to "Available"

## 🧪 Testing (Postman)
All endpoints were tested using Postman after completing the backend.

Recommended order:

1- Register advisor + student

2- Login

3- Create slots

4- Get slots (filters)

5- Book appointment

6- View student/advisor appointments

7- Complete / Cancel
