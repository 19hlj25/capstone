import { verifyToken } from "../utils/jwt.js";
import { getUserById } from "../db/queries/users.js";

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
    next(error);
  }
}