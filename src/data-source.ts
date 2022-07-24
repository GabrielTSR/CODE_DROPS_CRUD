import { DataSource } from 'typeorm';

//This class represents the connection to the entire database
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '12345678',
    database: 'code_drops_crud',
    synchronize: true,
    logging: false,
    entities: ['src/app/entity/*.ts'],
    migrations: ['src/database/migrations/*.ts'],
});

//Command to create a migration
//yarn typeorm migration:create src/database/migrations/MigrationName

//Command to run migrations
//yarn typeorm migration:run -d src/data-source.ts

//Command to revert migrations
//yarn typeorm migration:revert -d src/data-source.ts
