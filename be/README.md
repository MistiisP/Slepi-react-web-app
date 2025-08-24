## Our backend API

TODO: Write description or instructions
Backend run on Express.js using PostgreSQL database with Prisma ORM

### Data entities
- Chicken
- Feed
- Egg
- Sold egg

All CRUDs ops are implement on Chicken and Feed. 
Egg and Sold egg implement only Read and Create
All params are required
All API routes are divide into separete file and works with Express Router

### Instruction to setup backend
- run `npm install` in terminal to download all dependencies
- Create database
    - with docker
        - install docker desktop for win or docker engine for linux
        -  docker run --name docker-container-name -d --publish 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=databasename postgres
    - with instaler [here](https://www.postgresql.org/download)
- run `npx prisma migrate dev` in terminal to apply migrations
- create .env file (already is created default .env)
    - add `DATABASE_URL=postgresql://postgres@localhost:5432/databasename` to file

