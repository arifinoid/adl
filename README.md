# Activity Daily Living (ADL) Backend

Backend service for the Activity Daily Living (ADL) PWA application. This project is built using a modern, high-performance stack focusing on developer experience and speed.

## 🚀 Tech Stack
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia.js](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL (Supabase or Local Docker)
- **Validation**: [TypeBox](https://github.com/sinclairzx81/typebox)
- **Documentation**: [Swagger](https://swagger.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## 🏗 Architecture
This project follows a **Modular Architecture** pattern. Each feature or domain is contained within its own directory under `src/modules`.

### Folder Structure
- `src/modules/`: Contains domain-specific modules (Auth, Users, Activities).
  - `index.ts`: Controller and route definitions.
  - `service.ts`: Business logic and database operations.
  - `model.ts`: TypeBox schemas for request/response validation.
- `src/db/`: Database configuration and schema definitions.
  - `schema.ts`: Drizzle table definitions.
- `src/plugins/`: Global Elysia plugins (e.g., Auth, Logger).
- `tests/`: Unit and integration tests using `bun test`.
- `.agents/`: Custom AI agent skills for automated development tasks.

### File Naming Conventions
- `*.test.ts`: Test files.
- `*.service.ts`: Service layer files.
- `*.model.ts`: Validation schema files.

## 🛠 Prerequisites
- [Bun](https://bun.sh/) installed locally.
- [Docker](https://www.docker.com/) and `docker-compose` (optional, for local DB).

## ⚙️ Setup Instructions

1. **Environment Variables**:
   Copy the example environment variables file and configure your database URL.
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Database Synchronization**:
   Push your schema to the database:
   ```bash
   bun run db:push
   ```

## 🏃 Running the Application

### Local Development
Run the server with hot reload:
```bash
bun run dev
```
The server will be available at `http://localhost:8000`.

### Running with Docker
Start the entire stack (App + Database):
```bash
docker-compose up --build
```
To run only the database:
```bash
docker-compose up -d db
```

## 🧪 Testing
We use `bun test` for our test suite. Ensure your database is running before executing tests as they perform database operations with cleanup.
```bash
bun test tests/
```

## 📖 API Documentation
Once the server is running, you can access the beautiful, interactive API documentation (powered by **Scalar**) at:
`http://localhost:8000/swagger`

### Key Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **Users**: `/api/users/profile`
- **Activities**: `/api/activities` (Full CRUD)

## 🤖 AI Agent Skills
This repository is equipped with agent skills in the `.agents` folder. These skills can be used by compatible AI coding assistants to automate tasks like creating new modules, running tests, or performing code cleanups.
