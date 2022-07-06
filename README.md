# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `data-source.ts` file
3. Run the migrations with `yarn typeorm migration:run -d src/data-source.ts`
4. Configure environment variables in `.env` file
5. Run `yarn dev` command
