import express from 'express';
import helmet from 'helmet';
import Bootstrap from './modules/app';
import ErrorHandler from './lib/error-handler';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { corsOptions } from './config/cors';
import { rateLimiter } from './config/rate-limiter';
import { notFoundRoute } from './routes/404';

//server configuration
config();
const app = express();
const dbUri = process.env.DB_URI || '';
const PORT = Number(process.env.DB_URI) || 5700;

// middlewares
app.use(helmet());
app.use(corsOptions);
app.use(rateLimiter);
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());

app.use(notFoundRoute);
app.use(ErrorHandler.handler);

const server = new Bootstrap({ app, port: PORT, dbUri });
server.start();
