import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Creates a signed JWT for authenticated users.
// Throws a clear error if JWT_SECRET is missing from environment variables.
export function createToken(payload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verifies a JWT and returns its decoded payload.
// Throws error if the token is invalid or JWT_SECRET is missing.
export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.verify(token, JWT_SECRET);
}