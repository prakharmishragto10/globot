import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);

  // Required env vars for tests
  process.env.JWT_SECRET = "testsecret";
  process.env.NODE_ENV = "test";
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongo.stop();
});
