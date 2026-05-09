CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('child','parent','teacher')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INT,
  class_level VARCHAR(40),
  parent_id INT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS teacher_children (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, child_id)
);

CREATE TABLE IF NOT EXISTS daily_states (
  id SERIAL PRIMARY KEY,
  child_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_level VARCHAR(10) NOT NULL CHECK (energy_level IN ('low','medium','high')),
  focus_level VARCHAR(10) NOT NULL CHECK (focus_level IN ('low','medium','high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(child_id, date)
);

CREATE TABLE IF NOT EXISTS homework (
  id SERIAL PRIMARY KEY,
  child_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  subject VARCHAR(80) NOT NULL,
  due_date DATE NOT NULL,
  estimated_minutes INT NOT NULL CHECK (estimated_minutes > 0),
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  priority INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  homework_id INT NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  status VARCHAR(12) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','postponed')),
  task_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS task_progress (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  child_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(12) NOT NULL CHECK (status IN ('completed','postponed')),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_homework_child ON homework(child_id);
CREATE INDEX IF NOT EXISTS idx_homework_teacher ON homework(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tasks_homework ON tasks(homework_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_child_date ON task_progress(child_id, date);
