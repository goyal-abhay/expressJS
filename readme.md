
# Development Instructions

1. Initialize npm-

`npm init`

2. Install ExpressJS

`npm install express`

3. Install and initialize prisma

`npm install prisma `

`npx prisma init`

4. Install @prisma/client

`npm install @prisma/client`

5. Install yup

`npm install yup`

6. Install dotenv

`npm install dotenv`

7. Install body-parser

`npm install body-parser`

8. Setup Postgres DB

`DATABASE_URL=postgresql://<username>:<password>@<hostname>:<port>/<database_name>`

9. Generate Prisma client

`npx prisma generate`

10. Create DB

`npx prisma db pull`

11. Add environment variables

Add the following environment variables in .env file 

```php
dev_user = username
dev_password = password
dev_host = hostname
dev_port = port
dev_database = database_name
```