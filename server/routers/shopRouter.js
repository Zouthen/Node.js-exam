import sqlite3 from 'sqlite3';
import nodemailer from 'nodemailer';
import { Router } from "express";
const router = Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.nodeMailerUser,
    pass: process.env.nodeMailerPass
  }
});

const db = new sqlite3.Database('examdb.sqlite');

db.run(`
  CREATE TABLE IF NOT EXISTS shopwares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    stock INTEGER
  )
`);

router.get('/api/shopwares', (req, res) => {
  db.all('SELECT * FROM shopwares', (err, rows) => {
    if (err) {
      res.send({ message: 'Internal Server Error' });
    } else {
      res.send(rows);
    }
  });
});

router.patch('/api/shopwares/:id', async (req, res) => {
  const sold = parseInt(req.body.sold);
  const { id } = req.params;

  if (isNaN(sold)) {
    return res.send({ message: 'Invalid input' });
  }

  db.get('SELECT stock FROM shopwares WHERE id = ?', [id], async (err, row) => {
    if (err) {
      res.send({ message: 'Error retrieving stock' });
    } else if (row) {
      const newStock = row.stock - sold;
      if (newStock < 0) {
        res.send({ message: 'Insufficient stock' });
      } else {
        try {
          await updateStock(id, newStock);
          res.send({ message: 'Stock updated successfully' });
        } catch (error) {
          res.send({ message: 'Failed to update stock' });
        }
      }
    } else {
      res.send({ message: 'Item not found' });
    }
  });
});

async function updateStock(id, newStock) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE shopwares SET stock = ? WHERE id = ?',
      [newStock, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

router.post('/api/shopwares/bulk-order', async (req, res) => {
  const { orders, email } = req.body;

  db.serialize(() => {
    const stmt = db.prepare('UPDATE shopwares SET stock = stock - ? WHERE id = ? AND stock >= ?');
    let orderSummary = "Your Order Details:\n\n";
    for (let order of orders) {
      stmt.run(order.quantity, order.id, order.quantity, function(err) {
        if (err) {
          res.send({ message: 'Failed to update stock', error: err.message });
          return;
        }
        orderSummary += `Item: ${order.name}, Quantity: ${order.quantity}\n`;
      });
    }
    stmt.finalize(() => {
      sendConfirmationEmail(email, orderSummary);
      res.send({ message: 'Stock updated successfully and email sent.' });
    });
  });
});

function sendConfirmationEmail(email, orderSummary) {
  const mailOptions = {
    from: process.env.nodeMailerUser,
    to: email,
    subject: 'Order Confirmation',
    text: orderSummary
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
  });
}


export default router;
