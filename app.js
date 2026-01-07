import express from "express";
import cors from "cors";
import chatRoutes from "./modules/chat/chat.route.js";

const app = express();

//global midddleware
app.use(cors());
app.use(express.json());

//health check route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "GlobeBot Backend",
    message: "Server is running",
  });
});

//chat session routes
app.use("/api/chat", chatRoutes);
export default app;
