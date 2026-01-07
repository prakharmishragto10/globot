import express from "express";
import cors from "cors";

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
export default app;
