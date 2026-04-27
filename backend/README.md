# PingUp Backend

Spring Boot REST API for the PingUp social media frontend.

## Requirements

- JDK 8+ (not only JRE)
- Maven 3.8+
- MySQL 8+

This backend uses MySQL by default. H2 is still available as a development profile.

## MySQL Setup

Create the database manually:

```sql
CREATE DATABASE IF NOT EXISTS pingup
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Default connection values:

```text
database: pingup
username: root
password: root
port: 3306
```

You can override them with environment variables:

```powershell
$env:MYSQL_URL="jdbc:mysql://localhost:3306/pingup?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:MYSQL_USERNAME="root"
$env:MYSQL_PASSWORD="your_mysql_password"
```

Or run MySQL with Docker:

```powershell
docker compose up -d
```

If Maven says `No compiler is provided`, set `JAVA_HOME` to a JDK folder, for example:

```powershell
$env:JAVA_HOME="D:\eng\IntelliJ IDEA 2025.3.2\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

## Run

```powershell
cd backend
mvn spring-boot:run
```

The API will be available at:

```text
http://localhost:8080/api
```

## Optional H2 Mode

If you want to run without MySQL:

```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```

H2 console in this mode:

```text
http://localhost:8080/api/h2-console
```

## Demo Account

```text
email: admin@example.com
password: password123
```

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users`
- `GET /api/users/{id}`
- `GET /api/posts/feed`
- `POST /api/posts`
- `PUT /api/posts/{id}`
- `DELETE /api/posts/{id}`
- `POST /api/posts/{id}/like`
- `GET /api/stories`
- `POST /api/stories`
- `GET /api/messages/recent`
- `GET /api/messages/{userId}`
- `POST /api/messages`
- `POST /api/connections/{userId}`
- `DELETE /api/connections/{userId}`
- `GET /api/connections/{userId}/followers`
- `GET /api/connections/{userId}/following`
