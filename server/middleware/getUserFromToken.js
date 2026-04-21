import { verifyToken } from "../utils/jwt.js";
import { getUserById } from "../db/queries/users.js";

// Reads the Authorization token, verifies it, and attaches the matching user to req.user.
// If the token is missing or invalid, the request continues without a logged-in user.
export default async function getUserFromToken(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return next();
    }

    const token = auth.slice(7);
    const payload = verifyToken(token);
    const user = await getUserById(payload.id);

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("Error in getUserFromToken:", error);
    req.user = null;
    next();
  }
}