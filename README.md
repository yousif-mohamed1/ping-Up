# PingUp

PingUp is a social media app with a React + Vite frontend and a Spring Boot backend.

Backend requires a JDK, not only a JRE.

## Frontend

```powershell
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Backend

Start MySQL first. If you have Docker:

```powershell
cd backend
docker compose up -d
```

Then run Spring Boot:

```powershell
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080/api
```

The backend uses MySQL by default:

```text
database: pingup
username: root
password: root
```

You can override the connection with `MYSQL_URL`, `MYSQL_USERNAME`, and `MYSQL_PASSWORD`.

Demo account:

```text
email: admin@example.com
password: password123
```

## Run Everything With Docker

Start Docker Desktop first, then stop any local backend/frontend servers already using ports `3306`, `8080`, or `5173`.

From the project root:

```powershell
docker compose up --build
```

This starts:

```text
frontend: http://localhost:5173
backend:  http://localhost:8080/api
mysql:    localhost:3306
```

To stop everything:

```powershell
docker compose down
```

To stop everything and delete the MySQL data volume:

```powershell
docker compose down -v
```

## Features

- Clerk-powered frontend login screen
- Spring Boot REST API
- JWT auth for backend write operations
- Users and profile editing
- Feed posts with create, edit, delete, and likes
- Stories
- Messages
- Followers/following connections
- MySQL database with seed data
- Optional H2 profile for quick local development
