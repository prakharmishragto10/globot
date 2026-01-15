import jwt from "jsonwebtoken";
import AdminUser from "../../modules/admin/admin.model.js";

export const createAdminAndToken = async () => {
  const admin = await AdminUser.create({
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET || "testsecret",
    { expiresIn: "1h" }
  );

  return token;
};
