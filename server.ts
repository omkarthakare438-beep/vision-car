import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("rental.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    price INTEGER,
    image TEXT,
    available INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    car_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    total_price INTEGER,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(car_id) REFERENCES cars(id)
  );
`);

// Seed initial data if empty
const carCount = db.prepare("SELECT COUNT(*) as count FROM cars").get() as { count: number };
if (carCount.count === 0) {
  const insertCar = db.prepare("INSERT INTO cars (name, type, price, image) VALUES (?, ?, ?, ?)");
  insertCar.run("Tesla Model 3", "Electric", 120, "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800");
  insertCar.run("BMW M4", "Sport", 150, "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800");
  insertCar.run("Audi Q7", "SUV", 130, "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800");
  insertCar.run("Mercedes C-Class", "Luxury", 140, "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Routes
  app.post("/api/register", (req, res) => {
    const { email, password } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, password);
      res.json({ id: info.lastInsertRowid, email, role: 'user' });
    } catch (e) {
      res.status(400).json({ error: "User already exists" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ id: user.id, email: user.email, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Car Routes
  app.get("/api/cars", (req, res) => {
    const cars = db.prepare("SELECT * FROM cars").all();
    res.json(cars);
  });

  app.post("/api/cars", (req, res) => {
    const { name, type, price, image } = req.body;
    const info = db.prepare("INSERT INTO cars (name, type, price, image) VALUES (?, ?, ?, ?)").run(name, type, price, image);
    res.json({ id: info.lastInsertRowid, name, type, price, image, available: 1 });
  });

  app.delete("/api/cars/:id", (req, res) => {
    db.prepare("DELETE FROM cars WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/cars/:id", (req, res) => {
    const { available } = req.body;
    db.prepare("UPDATE cars SET available = ? WHERE id = ?").run(available, req.params.id);
    res.json({ success: true });
  });

  // Booking Routes
  app.post("/api/bookings", (req, res) => {
    const { user_id, car_id, start_date, end_date, total_price } = req.body;
    const info = db.prepare("INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)").run(user_id, car_id, start_date, end_date, total_price);
    db.prepare("UPDATE cars SET available = 0 WHERE id = ?").run(car_id);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/bookings/:userId", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, c.name as car_name, c.image as car_image 
      FROM bookings b 
      JOIN cars c ON b.car_id = c.id 
      WHERE b.user_id = ?
    `).all(req.params.userId);
    res.json(bookings);
  });

  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, c.name as car_name, u.email as user_email 
      FROM bookings b 
      JOIN cars c ON b.car_id = c.id 
      JOIN users u ON b.user_id = u.id
    `).all();
    res.json(bookings);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
