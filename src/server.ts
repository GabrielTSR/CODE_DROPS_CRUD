import 'reflect-metadata';
import 'dotenv/config';
import './database';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();

app.use(
    express.json({
        strict: false,
    })
);
//Morgan is a library to log requests
app.use(morgan('dev'));

app.use(cors());

app.use(router);
app.use(express.urlencoded({ extended: true }));

app.listen(3333, () => {
    console.log('Server started at http://localhost:3333');
});
