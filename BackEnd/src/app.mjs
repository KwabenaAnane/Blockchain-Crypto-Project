import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDb } from './db/datanase.mjs';

dotenv.config({ path: './config/config.env' });

await connectDb()

const app = express();

app.use(cors());

app.use(express.json());



export { app };
