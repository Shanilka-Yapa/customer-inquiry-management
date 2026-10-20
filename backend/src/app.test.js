const request = require("supertest");
const app = require("./app");

describe("Authentication", () => {
  test("rejects requests without an authentication token", async () => {
    const response = await request(app).get("/api/inquiries");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication token required");
  });
});