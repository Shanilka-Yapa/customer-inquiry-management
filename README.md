# Customer Inquiry Management System — Backend

REST API built with Node.js, Express, PostgreSQL, and Prisma.

## Requirements

- Node.js
- PostgreSQL
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the backend directory:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/customer_inquiry_db?schema=public"
   JWT_SECRET="replace-with-a-long-random-secret"
   PORT=5000
   ```

   Replace the database credentials and JWT secret with your local values.

3. Apply database migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Generate the Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Seed the staff account:

   ```bash
   npm run seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:5000`.

## Test Account

- Email: `staff@coffeeninja.com`
- Password: `Staff@12345`

Use this account to obtain a JWT through `POST /api/auth/login`.

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/login` | Staff login | No |
| POST | `/api/inquiries` | Create an inquiry | Required |
| GET | `/api/inquiries` | List and filter inquiries | Required |
| GET | `/api/inquiries/:id` | Get inquiry details | Required |
| PATCH | `/api/inquiries/:id/status` | Update inquiry status | Required |

Supported statuses: `NEW`, `IN_PROGRESS`, `RESOLVED`.

## Tests

Run backend tests:

```bash
npm test
```