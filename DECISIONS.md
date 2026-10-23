# Engineering Decisions — InquiryDesk

## 1. Assumptions

InquiryDesk is designed for a small internal customer support team.

- Staff members must authenticate before accessing inquiries.
- All authenticated staff can view and update all inquiries.
- Each inquiry has one of three statuses: `NEW`, `IN_PROGRESS`, or `RESOLVED`.
- Similar inquiries may represent separate customer requests, so duplicates are permitted.
- Customer contact information may be an email address or phone number.

## 2. Key Engineering Decisions

### Decision 1: Shared Staff Access

**Choice:** All authenticated staff members can access and update inquiries, including those created by other staff members.

**Reason:** Customer support is a collaborative workflow. Shared visibility allows staff to handle inquiries when the original creator is unavailable.

**Implementation:** JWT authentication middleware protects the inquiry API endpoints. The backend enforces authentication rather than relying only on frontend route protection.

**Trade-off:** There are no separate administrator or staff roles. A larger application would benefit from role-based access control.

### Decision 2: Flexible Status Transitions

**Choice:** Staff can change an inquiry between `NEW`, `IN_PROGRESS`, and `RESOLVED`, including reopening a resolved inquiry.

**Reason:** Customer issues may require further investigation after being marked resolved.

**Trade-off:** The application does not maintain a history of status changes. An audit log would improve accountability.

### Decision 3: Duplicate Inquiry Handling

**Choice:** Duplicate inquiries are allowed.

**Reason:** Two inquiries with similar subjects or contact details may describe separate incidents. Automatically rejecting duplicates could prevent legitimate requests from being recorded.

**Trade-off:** Duplicate records may require manual review. A future enhancement could display possible duplicates without blocking submission.

## 3. Concurrent Updates

When two staff members open the same inquiry in separate browser tabs, both may initially see the same status.

If both update the inquiry, the most recent successful update overwrites the previous status.

**Current approach:** Last-write-wins, with a manual Refresh button to retrieve the latest inquiry information.

**Limitation:** Refreshing does not prevent conflicting updates.

**Future improvement:** Optimistic concurrency control using a record version or `updatedAt` comparison, returning a conflict response when another user has modified the inquiry.

## 4. Validation and Error Handling

Required inquiry fields are validated in both the frontend and backend.

The backend uses Zod to reject missing or invalid fields, ensuring that validation cannot be bypassed through direct API requests.

The API also handles unauthenticated requests, invalid inquiry IDs, and missing records.

The frontend provides loading indicators, error messages, and empty states to make these situations understandable to users.

## 5. Testing Strategy

**Backend:** Jest and Supertest are used to test authentication protection and inquiry validation.

**Frontend:** Vitest and React Testing Library verify required fields and maximum input lengths.

**Manual testing:** Login, inquiry creation, searching, filtering, viewing details, status updates, reopening inquiries, and error handling.

**Testing gaps:** Automated tests do not currently cover the complete login-to-resolution workflow, concurrent updates, or every API endpoint.

## 6. AI Assistance

AI tools were used as development assistance during implementation.

**Accepted suggestion:** Separating the frontend into dedicated pages and reusable components instead of placing the entire application in one component.

**Modified suggestion:** Adjusting the inquiry interface and highlighting records created by the logged-in staff member while preserving shared access to all inquiries.

**Rejected suggestion:** Adding features outside the assessment scope, such as unnecessary deployment infrastructure, to prioritize the required workflow and testing.

All generated suggestions were reviewed and adapted to the project's requirements.

## 7. Next Improvement

The highest-priority improvement would be optimistic concurrency control for status updates.

This would prevent one staff member from unintentionally overwriting another staff member's changes and make the application more reliable in a collaborative environment.