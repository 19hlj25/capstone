import express from "express";
import { getAllBusinesses } from "../db/queries/businesses.js"

const router = express.Router();

/**
 * Gets all businesses
 * sends the full list of businesses from the database
 */
router.get("/", async (req, res, next) => {
    try {
        const businesses = await getAllBusinesses();
        res.send(businesses);
    } catch (error) {
        next(error);
    }
});

export default router;