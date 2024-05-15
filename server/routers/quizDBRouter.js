import sqlite3 from 'sqlite3';
import { Router } from 'express';
const router = Router();

const db = new sqlite3.Database('examdb.sqlite');

db.run(`
  CREATE TABLE IF NOT EXISTS quizScores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mail TEXT UNIQUE,
    correctAnswers INTEGER,
    timesPlayed INTEGER
  )
`);

router.get('/api/quizScores', (req, res) => {
  db.all('SELECT * FROM quizScores', (err, rows) => {
    if (err) {
      res.send({ message: 'Internal Server Error' });
    } else {
      res.send(rows);
    }
  });
});

router.get('/api/quizScores/:mail', async (req, res) => {
  const { mail } = req.params;

  if (!mail) {
    return res.send({ message: 'Invalid mail provided' });
  }

  db.get('SELECT * FROM quizScores WHERE mail = ?', [mail], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.send({ message: 'Internal Server Error' });
    }

    if (row) {
      res.send(row);
    } else {
      res.send({ message: 'User not found' });
    }
  });
});

async function findUserByEmail(mail) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM quizScores WHERE mail = ?', [mail], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function updateUserScore(mail, correctAnswers, timesPlayed) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE quizScores SET correctAnswers = ?, timesPlayed = ? WHERE mail = ?',
      [correctAnswers, timesPlayed, mail],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

async function insertNewUser(mail, correctAnswers) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO quizScores (mail, correctAnswers, timesPlayed) VALUES (?, ?, ?)',
      [mail, correctAnswers, 1],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

router.post('/api/quizScores', async (req, res) => {
  const { mail, correctAnswers } = req.body;

  if (!mail || typeof correctAnswers !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const existingUser = await findUserByEmail(mail);

    if (existingUser) {
      const newCorrectAnswers = Math.max(existingUser.correctAnswers, correctAnswers);
      const newTimesPlayed = existingUser.timesPlayed + 1;

      await updateUserScore(mail, newCorrectAnswers, newTimesPlayed);
      res.json({ message: 'User score updated successfully' });
    } else {
      await insertNewUser(mail, correctAnswers);
      res.json({ message: 'New user score saved successfully' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.delete('/api/quizScores/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM quizScores WHERE id = ?', [id], (err) => {
    if (err) {
      res.send({ message: 'Internal Server Error' });
    } else {
      res.send({ message: 'Document deleted successfully' });
    }
  });
});


export default router;