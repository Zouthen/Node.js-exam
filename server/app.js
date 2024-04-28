import "dotenv/config";
import express from 'express';

const app = express();

import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

import path from "path";
app.use(express.static(path.resolve("../client/dist")));
app.use(express.json()); 
   
import { rateLimit } from 'express-rate-limit';
const allRoutesRatelimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(allRoutesRatelimiter);

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use("/auth", authRateLimiter);

import helmet from 'helmet';
app.use(helmet());

import cors from 'cors';
app.use(cors({
    credentials: true,
    origin: true
}));

// ============== Session ==============

import session from 'express-session';
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ============== Sockets ==============
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  
    socket.on('chat message', (data) => {
      io.emit('chat message', data);
    });
  });

// ============== Routers ==============

import beastsDBRouter from './routers/beastsDBRouter.js';
app.use(beastsDBRouter);

import authFirebaseRouter from "./routers/authFirebaseRouter.js";
app.use(authFirebaseRouter);

import contactRouter from "./routers/contactRouter.js";
app.use(contactRouter);

import quizRouter from "./routers/quizRouter.js";
app.use(quizRouter);

// ============== Wildcard route ==============

app.get('*', (req, res) => {
    res.send("<h1>404 - Page Not Found</h1>");
});

app.all('*', (req, res) => {
    res.status(404).send({ data: `Unsupported Request ${req.path}` });
});

//=============================================================================

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
