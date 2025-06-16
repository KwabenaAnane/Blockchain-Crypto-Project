import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { connectDb } from './db/database.mjs';

dotenv.config({ path: './config/config.env' });

await connectDb();

// Konfigurera regler för begränsning av förfrågningar ifrån en och samma ip-adress
const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000,
  message: 'You are killing me, get lost!!!',
});

const app = express();

app.use(helmet());

app.use(cors());

app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));

// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//   })
// );

app.use(xss());

app.use(hpp());

export { app };
