// MUST be first line — no exceptions
import "dotenv/config";

import app from "./app.js";
import { connectMongo } from "./config/mongo.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`GlobeBot server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
};

startServer();
