Usefull commands:

1. start dev server:
`npm run dev`

2. create sequleize migration:
`npx sequelize-cli migration:generate --name create-layouts`
`npx sequelize-cli migration:generate --name create-locations`
    a. Edit created migration files to define db tables. 

3. run migration:
`npx sequelize-cli db:migrate`

4. undo last migration:
`npx sequelize-cli db:migrate:undo`

5. Undo all migrations:
`npx sequelize-cli db:migrate:undo:all`