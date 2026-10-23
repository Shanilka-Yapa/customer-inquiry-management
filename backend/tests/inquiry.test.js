const request = require("supertest");
const app = require("../src/app");

describe("Customer Inquiry API", () => {
  describe("Authentication", () => {
    test("rejects requests without an authentication token", async () => {
      const response = await request(app).get("/api/inquiries");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Inquiry Validation", () => {
    test("rejects inquiry creation when required fields are missing", async () => {
      const jwt = require("jsonwebtoken");

      const token = jwt.sign(
        { id: 1, email: "test@example.com" },
        process.env.JWT_SECRET || "test-secret",
        { expiresIn: "1h" }
      );

      const response = await request(app)
        .post("/api/inquiries")
        .set("Authorization", `Bearer ${token}`)
        .send({
          customerName: "",
          contact: "",
          subject: "",
          description: "",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });
});