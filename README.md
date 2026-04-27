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
