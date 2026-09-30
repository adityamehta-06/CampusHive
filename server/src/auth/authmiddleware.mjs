import jwt from "jsonwebtoken";

// JWT check
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first." });
  }

  // remove "Bearer "
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Your login session has expired. Please log in again." });
    }
    req.user = user;
    next();
  });
};

export default authMiddleware;
