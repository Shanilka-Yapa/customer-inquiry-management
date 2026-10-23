# InquiryDesk — Customer Inquiry Management System

InquiryDesk is a full-stack web application developed for the Coffee Ninja Full Stack Development Technical Assessment.

It allows authenticated staff members to record, search, view, and manage customer inquiries.

## Technology Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios

**Backend:** Node.js, Express.js, Prisma ORM, Zod, JWT

**Database:** PostgreSQL

**Testing:** Jest, Supertest, Vitest, React Testing Library

## Features

- Staff registration and login
- JWT-based authentication
- Create customer inquiries with required-field validation
- View and search inquiries
- Filter inquiries by status
- View inquiry details and creator information
- Update inquiry status
- Reopen resolved inquiries
- Refresh inquiry details to retrieve the latest status
- Loading, empty, and error states
- Responsive user interface

## Project Structure

```text
customer-inquiry-management/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   └── tests/
├── frontend/
│   └── src/
├── README.md
└── DECISIONS.md
```

## Prerequisites

- Node.js and npm
- PostgreSQL
- Git

## Backend Setup

1. Open a terminal in the `backend` directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database named `customer_inquiry_db`.

4. Create a `.env` file in the `backend` directory containing:

   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/customer_inquiry_db"
   JWT_SECRET="replace-with-a-secure-secret"
   PORT=5000
   ```

   Replace `YOUR_PASSWORD` with your PostgreSQL password.

5. Generate the Prisma client and apply migrations:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

6. Seed the database:

   ```bash
   npm run seed
   ```

7. Start the backend:

   ```bash
   npm run dev
   ```

The backend runs at `http://localhost:5000`.

## Frontend Setup

1. Open a separate terminal in the `frontend` directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local address displayed by Vite.

The frontend communicates with the backend through its API at `http://localhost:5000/api`.

## Test Account

After running the seed script, use:

**Email:** `staff@coffeeninja.com`

**Password:** `Staff@12345`

Alternatively, create an account through the signup page.

## Running Automated Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

To verify the frontend production build:

```bash
npm run build
```

## API Overview

All inquiry endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a staff member |
| POST | `/api/inquiries` | Create an inquiry |
| GET | `/api/inquiries` | List and search inquiries |
| GET | `/api/inquiries/:id` | Retrieve an inquiry |
| PATCH | `/api/inquiries/:id/status` | Update inquiry status |

Inquiry statuses: `NEW`, `IN_PROGRESS`, and `RESOLVED`.

## Testing Notes

Automated tests cover backend authentication and validation, as well as frontend required fields and input length constraints.

Additional manual testing should cover login, inquiry creation, search/filtering, status changes, invalid input, and unauthorized access.

## Known Limitations

- Concurrent status changes use a last-write-wins approach.
- Status-change history is not maintained.
- Duplicate inquiries are permitted.
- The application is intended for a small internal staff workflow.

See `DECISIONS.md` for implementation decisions and trade-offs.