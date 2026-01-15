import request from "supertest";
import app from "../app.js";

describe("Chat APIs", () => {
  let sessionId;

  it("should start chat", async () => {
    const res = await request(app).post("/api/chat/start");
    expect(res.status).toBe(201);
    sessionId = res.body.sessionId;
  });

  it("should capture name", async () => {
    const res = await request(app).post("/api/chat/message").send({
      sessionId,
      message: "My name is Rahul",
    });

    expect(res.status).toBe(200);
    expect(res.body.reply.toLowerCase()).toContain("email");
  });

  it("should capture email", async () => {
    const res = await request(app).post("/api/chat/message").send({
      sessionId,
      message: "rahul@gmail.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.reply.toLowerCase()).toContain("country");
  });

  it("should end chat", async () => {
    const res = await request(app).post("/api/chat/end").send({ sessionId });

    expect(res.status).toBe(200);
  });
});
