import { AppDataSource } from './../data-source';
import { createDefaultData } from './createDefaultData';

AppDataSource.initialize().then(() => {
    console.log('Database connected');

    //Primary data is created here
    createDefaultData();
});
