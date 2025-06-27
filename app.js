/* ===========================================================
   Express + SQLite REST API – ready for Render.com
   Now with gender & age columns
   =========================================================== */

const express  = require('express');
const sqlite3  = require('sqlite3').verbose();
const path     = require('path');
// const cors  = require('cors');            // optional

const app  = express();
const PORT = process.env.PORT || 3002;     // Render injects PORT

/* ---------- middleware ---------- */
app.use(express.json());
// app.use(cors());

/* Serve static front-end assets (index.html, JS, CSS, …) */
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- database ---------- */
const dbPath = path.join(__dirname, 'employees.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('❌ SQLite connection error:', err.message);
  } else {
    console.log('✅ Connected to SQLite');
  }
});

/* Create table if it doesn’t exist */
db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name   TEXT    NOT NULL,
    email  TEXT    NOT NULL UNIQUE,
    role   TEXT,
    gender TEXT,
    age    INTEGER
  )
`, err => {
  if (err) console.error('❌ Table create error:', err.message);
});

/* ---------- health-check (Render pings "/") ---------- */
app.get('/', (_, res) => res.send('API up and running'));

/* ===========================================================
   REST endpoints – CRUD for /employees
   =========================================================== */

/* GET all employees */
app.get('/employees', (_, res) => {
  db.all('SELECT * FROM employees', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* GET one employee by id */
app.get('/employees/:id', (req, res) => {
  db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Employee not found' });
    res.json(row);
  });
});

/* POST create new employee */
app.post('/employees', (req, res) => {
  const { name, email, role, gender, age } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: 'Name and email are required' });

  const sql = `
    INSERT INTO employees (name, email, role, gender, age)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [name, email, role || null, gender || null, age || null];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    /* this.lastID is the row id just inserted */
    db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (_, row) =>
      res.status(201).json(row)
    );
  });
});

/* PUT update employee */
app.put('/employees/:id', (req, res) => {
  const { name, email, role, gender, age } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE employees
    SET name = ?, email = ?, role = ?, gender = ?, age = ?
    WHERE id = ?
  `;
  const params = [name, email, role, gender, age, id];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (!this.changes)
      return res.status(404).json({ error: 'Employee not found' });

    db.get('SELECT * FROM employees WHERE id = ?', [id], (_, row) =>
      res.json(row)
    );
  });
});

/* DELETE employee */
app.delete('/employees/:id', (req, res) => {
  db.run('DELETE FROM employees WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (!this.changes)
      return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  });
});

/* ===========================================================
   graceful shutdown – close the DB before Node exits
   =========================================================== */
const closeDb = () =>
  db.close(() => console.log('🛑 SQLite connection closed'));
process.on('SIGTERM', closeDb);
process.on('SIGINT',  closeDb);

/* ---------- start server ---------- */
app.listen(PORT, () =>
  console.log(`⚡ Server listening on port ${PORT}`)
);

/* ===========================================================
   End of file
   =========================================================== */
