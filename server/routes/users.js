import { createToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import express from "express";
import { getUserByUsername, getUserByEmail, createUser } from "../db/queries/users";

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

res.status(201).send({ token, user });
    } catch (error) {
        next(error);
    }
    });

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
    }
})
export default router;