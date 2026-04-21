import jwt from "jsonwebtoken";

/**
 * Creates a signed JWT for authenticated users.
 * Throws a clear error if JWT_SECRET is missing from environment variables.
 */
export function createToken(payload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws an error if the token is invalid or JWT_SECRET is missing.
 */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.verify(token, secret);
}