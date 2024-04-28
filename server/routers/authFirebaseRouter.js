import { Router } from "express"

import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/confic.js';

import nodemailer from 'nodemailer';

const router = Router()

router.post('/auth/login', async (req, res) => {
  try {
    if (!req.body) {
      return res.send({ data: "Request body is missing" });
    }


    const { email, password } = req.body;
    const userData = await signInWithEmailAndPassword(auth, email, password);

    req.session.user = {
      uid: userData.user.uid,
    };

    res.send({ data: "Login successful", userData });
  } catch (error) {
    console.log(error);
    res.send({ data: "Login failed" });
  }
});


router.post('/auth/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.error("Error destroying session:", error);
    } else {
      res.cookie("sessionID", "", { expires: new Date(0) });
      res.send({ data: "Logout successful" });
    }
  });
});

router.post('/auth/signup', async (req, res) => {
  console.log("signup");
  try {
    if (!req.body) {
      return res.status(400).send({ data: "Request body is missing" });
    }

    const { email, password } = req.body;

    const userData = await createUserWithEmailAndPassword(auth, email, password);

    req.session.user = {
      uid: userData.user.uid,
    };
    sendConfirmationEmail(email);
    res.send({ data: "Signup successful", userData });

  } catch (error) {
    console.log(error);
    res.send({ data: "Signup failed" });
  }
});

function sendConfirmationEmail(email) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: process.env.nodeMailerUser,
      pass: process.env.nodeMailerPass
    }
  });
  try {
    transporter.sendMail({
      from: process.env.nodeMailerUser,
      to: email,
      subject: 'Signup confirmation',
      text: `You have successfully signed up for my page!`,
      html: `<b>You have successfully signed up for my page!</b>`,
    });
    //res.send({ data: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default router