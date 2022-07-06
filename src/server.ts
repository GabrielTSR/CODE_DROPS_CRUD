import 'reflect-metadata';
import 'dotenv/config';
import './database';
import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();

app.use(
    express.json({
        strict: false,
    })
);
app.use(router);
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.listen(3333, () => {
    console.log('Server started at http://localhost:3333');
});
