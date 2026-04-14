import express from "express";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt.js";
import {
  getUserByUsername,
  getUserByEmail,
  createUser,
} from "../db/queries/users.js";

const router = express.Router();
const MIN_PASSWORD_LENGTH = 8;

// WHY (Code Style + Documentation): Centralizing normalization in one helper
// keeps auth rules consistent and easier to maintain for future route changes.
function normalizeRegisterInput(body = {}) {
  return {
    username: typeof body.username === "string" ? body.username.trim() : "",
    email:
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

// WHY (Code Style + Documentation): Using one helper for login input avoids
// repeated parsing logic and makes auth validation easier to read.
function normalizeLoginInput(body = {}) {
  return {
    username: typeof body.username === "string" ? body.username.trim() : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

// WHY (Functionality): Sending only safe profile fields avoids accidentally
// exposing private fields (like password hashes) in auth responses.
function toSafeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    plan_id: user.plan_id,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = normalizeRegisterInput(req.body);

    if (!username || !email || !password) {
      return res.status(400).send({
        error: "Username, email, and password are required.",
      });
    }

    // WHY (Functionality): A minimum password length catches weak passwords
    // early and makes the default auth flow safer for real users.
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).send({
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const existingUsername = await getUserByUsername(username);

    if (existingUsername) {
      return res.status(400).send({
        error: "Username already exists.",
      });
    }

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return res.status(400).send({
        error: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(username, email, hashedPassword);

    const token = createToken({ id: user.id });

    return res.status(201).send({ token, user: toSafeUser(user) });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = normalizeLoginInput(req.body);

    if (!username || !password) {
      return res.status(400).send({
        error: "Username and password are required.",
      });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).send({
        error: "Invalid credentials.",
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).send({
        error: "Invalid credentials.",
      });
    }

    const token = createToken({ id: user.id });

    res.send({
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
