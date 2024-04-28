import sqlite3 from 'sqlite3';
import { Router } from 'express';
const router = Router();

const db = new sqlite3.Database('examdb.sqlite');

db.run(`
  CREATE TABLE IF NOT EXISTS beasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

router.get('/api/beasts', (req, res) => {
  db.all('SELECT * FROM beasts', (err, rows) => {
    if (err) {
      res.send({ message: 'Internal Server Error' });
    } else {
      res.send(rows);
    }
  });
});

router.post('/api/beast', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO beasts (name) VALUES (?)', [name], (err) => {
    if (err) {
      res.send({ message: 'Internal Server Error' });
    } else {
      res.send({ message: 'Document inserted successfully' });
    }
  });
});

router.delete('/api/beast/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM beasts WHERE id = ?', [id], (err) => {
    if (err) {
      res.send({ message: 'Internal Server Error' });
    } else {
      res.send({ message: 'Document deleted successfully' });
    }
  });
});


export default router;