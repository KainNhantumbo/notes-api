import helmet from 'helmet';
import express from 'express';
import * as dotenv from 'dotenv';
import Bootstrap from './modules/app';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import { rateLimiter } from './config/rate-limiter';
import { authRoutes } from './routes/auth.routes';
import { healthRoutes } from './routes/api.routes';
import { userRoutes } from './routes/users.routes';
import { folderRoutes } from './routes/folders.routes';
import { notesRoutes } from './routes/notes.routes';
import { settingsRoutes } from './routes/settings.routes';

//server configuration
dotenv.config();
const app = express();
const dbUri = String(process.env.DB_URI);
const PORT = Number(process.env.PORT);

// middlewares
app.use(helmet());
app.use(corsOptions);
app.use(rateLimiter);
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// routes
app.use('/api/v1/healthcheck', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/folders', folderRoutes);
app.use('/api/v1/settings', settingsRoutes);

new Bootstrap({ app, port: PORT, dbUri });
