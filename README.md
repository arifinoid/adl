# Activity Daily Living (ADL) Backend App

Backend service for the Activity Daily Living (ADL) PWA application.

## Tech Stack
- **Bun** (Runtime & Package Manager)
- **Elysia JS** (Web Framework)
- **Drizzle ORM** (Database ORM)
- **Supabase / PostgreSQL** (Database)
- **TypeScript** (Language)
- **Docker** (Containerization)

## Prerequisites
- [Bun](https://bun.sh/) installed locally.
- [Docker](https://www.docker.com/) and docker-compose installed.
- Supabase account/project configured.

## Setup Instructions

1. **Environment Variables:**
   Copy the example environment variables file and fill in your Supabase database URL and other credentials.
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies:**
   ```bash
   bun install
   ```

## Database Setup

Run Drizzle migrations to sync your schema with the Supabase PostgreSQL database:
```bash
bun run db:generate
bun run db:push
```

## Running the Application

### Local Development
Run the server in development mode (with hot reload):
```bash
bun run dev
```
The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Using Docker
To build and run the application using Docker, run:
```bash
docker-compose up --build
```
This will containerize the backend and make it accessible locally.

## Available Scripts
- `bun run dev`: Start the development server.
- `bun run build`: Build the project for production.
- `bun run start`: Start the compiled production server.
- `bun run db:studio`: Open Drizzle Studio to view database contents.
