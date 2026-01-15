import request from "supertest";
import app from "../app.js";

describe("Admin Auth APIs", () => {
  it("should signup admin", async () => {
    const res = await request(app).post("/api/admin/signup").send({
      name: "Admin",
      email: "admin@test.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login admin", async () => {
    await request(app).post("/api/admin/signup").send({
      name: "Admin",
      email: "admin@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/admin/login").send({
      email: "admin@test.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
