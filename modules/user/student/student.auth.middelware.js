import jwt from "jsonwebtoken";

export const studentAuth = (req, res, next) => {
  const header = req.header.authorization;

  if (!header || !header.startWith("Bearer ")) {
    return res.status(401).json({});
  }

  try {
    const token = header.split("")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
