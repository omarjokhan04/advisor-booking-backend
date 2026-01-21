-- =========================
-- USERS (students + advisors)
-- =========================
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'advisor')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- ADVISOR SLOTS
-- =========================
CREATE TABLE IF NOT EXISTS advisor_slots (
  slot_id SERIAL PRIMARY KEY,
  advisor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  location VARCHAR(120) NOT NULL DEFAULT 'Advising Office',
  status VARCHAR(20) NOT NULL DEFAULT 'Available'
    CHECK (status IN ('Available','Booked','Completed','Canceled')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (advisor_id, slot_date, slot_time)
);

-- =========================
-- APPOINTMENTS
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id SERIAL PRIMARY KEY,
  slot_id INT NOT NULL UNIQUE REFERENCES advisor_slots(slot_id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  advisor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'Booked'
    CHECK (status IN ('Booked','Completed','Canceled')),
  booked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP NULL,
  CHECK (student_id <> advisor_id)
);

-- Indexes (simple & useful)
CREATE INDEX IF NOT EXISTS idx_slots_advisor_date ON advisor_slots(advisor_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_appt_student ON appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appt_advisor ON appointments(advisor_id);
