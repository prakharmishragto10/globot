import express from "express";
import cors from "cors";
import chatRoutes from "./modules/chat/chat.route.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import { initPaymentsModule } from "./modules/payments/payments.module.js";
import { initRegistrationsModule } from "./modules/payments/registrations.module.js";
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

//admin routes
app.use("/api/admin", adminRoutes);
export default app;

//testing of the payment sdk
initRegistrationsModule();
initPaymentsModule();
