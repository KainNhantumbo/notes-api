import express from 'express';
import { config } from 'dotenv';
import Bootstrap from './modules/server';
import helmet from 'helmet';
import { corsOptions } from './config/cors';

config();

const app = express();
const dbUri = process.env.DB_URI || '';
const PORT = Number(process.env.DB_URI) || 5700;

app.use(helmet())
app.use(corsOptions)
app.use(express.json())

new Bootstrap({ app, port: PORT, dbUri }).start();
