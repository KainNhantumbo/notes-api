import express from 'express';
import helmet from 'helmet';
import Bootstrap from './modules/app';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { corsOptions } from './config/cors';
import { rateLimiter } from './config/rate-limiter';

// configuration
config();
const app = express();
const dbUri = process.env.DB_URI || '';
const PORT = Number(process.env.DB_URI) || 5700;

app.use(helmet());
app.use(corsOptions);
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
const server = new Bootstrap({ app, port: PORT, dbUri });
server.start();
