import express from 'express';
import helmet from 'helmet';
import Bootstrap from './modules/app';
import compression from 'compression';
import ErrorHandler from './lib/error-handler';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { corsOptions } from './config/cors';
import { rateLimiter } from './config/rate-limiter';
import { notFoundRoute } from './routes/404';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/users.routes';
import { folderRoutes } from './routes/folders.routes';
import { notesRoutes } from './routes/notes.routes';

//server configuration
dotenv.config();
const app = express();
const dbUri = process.env.DB_URI || '';
const PORT = Number(process.env.DB_URI) || 5700;

// middlewares
app.use(helmet());
app.use(corsOptions);
app.use(rateLimiter);
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/folders', folderRoutes);

// error handlers
app.use(notFoundRoute);
app.use(ErrorHandler.handler);

const server = new Bootstrap({ app, port: PORT, dbUri });
server.start();
