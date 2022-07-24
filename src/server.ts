import 'dotenv/config';
import './database';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import { routes } from './routes';

//Creating express app
const app = express();

//Accepting requests in JSON form
app.use(
    express.json({
        strict: false,
    })
);

//Log requests
app.use(morgan('dev'));

//Allowing cross-origin requests
app.use(cors());

//Url encoding for the body
app.use(express.urlencoded({ extended: true }));

//Using the router
app.use('/api', routes);

//Initializing the server
const port = 3333;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
