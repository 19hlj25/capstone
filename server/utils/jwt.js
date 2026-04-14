import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// WHY (Functionality): Failing fast on startup prevents confusing auth bugs later
// where tokens fail unpredictably during login or protected requests.
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable.");
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}