import express from "express";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt.js";
import {
  getUserByUsername,
  getUserByEmail,
  createUser
} from "../db/queries/users.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    

    const { username, email, password } = req.body;
    

    if (!username || !email || !password) {
      return res.status(400).send({
        error: "Username, email, and password are required."
      });
    }

    const existingUsername = await getUserByUsername(username);
    

    if (existingUsername) {
      return res.status(400).send({
        error: "Username already exists."
      });
    }

    const existingEmail = await getUserByEmail(email);
    

    if (existingEmail) {
      return res.status(400).send({
        error: "Email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    

    const user = await createUser(username, email, hashedPassword);
    

    const token = createToken({ id: user.id });
    

    return res.status(201).send({ token, user });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        error: "Username and password are required."
      });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).send({
        error: "Invalid credentials."
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).send({
        error: "Invalid credentials."
      });
    }

    const token = createToken({ id: user.id });

    res.send({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        plan_id: user.plan_id
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;