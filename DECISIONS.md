# Technical Decisions

## Authentication and Access Control

Staff authenticate using email and password. Passwords are stored as bcrypt hashes, and successful login returns a signed JWT. Protected inquiry endpoints require a valid bearer token. Each inquiry is associated with its creator, and users can access only their own inquiries.

## Validation and Error Handling

Zod validates login credentials, inquiry fields, and status updates. Invalid input returns HTTP 400 with a predictable JSON error response. Missing, invalid, or expired tokens return HTTP 401. Invalid IDs return HTTP 400, while inquiries that do not exist or are inaccessible return HTTP 404.

## Inquiry Status

The supported statuses are `NEW`, `IN_PROGRESS`, and `RESOLVED`. Status updates are validated by the API. Repeating the current status returns a successful response without making an unnecessary database update.

## Database

PostgreSQL stores staff accounts and inquiries. Prisma manages database access and migrations. Database constraints enforce unique staff email addresses and valid inquiry-to-user relationships.

## Testing

Jest and Supertest verify that protected inquiry endpoints reject unauthenticated requests. API behavior has also been checked manually for login, inquiry creation, retrieval, and status validation.

## Limitations and Future Improvements

The current implementation scopes inquiries to their creators. A production deployment could introduce role-based shared access, audit logs, rate limiting, refresh-token handling, and more comprehensive automated tests.