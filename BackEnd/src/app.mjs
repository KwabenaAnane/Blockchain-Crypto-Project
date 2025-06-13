import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors());

app.use(express.json());

export { app };
