import express from "express";
import { getAllPlans } from "../db/queries/plans.js";

const router = express.Router();

//Sends all available subscription plans to the client.
//This route supports the frontedn plans display feature.
router.get("/", async (req, res, next) => {
    try {
        const plans= await getAllPlans();
        res.send(plans);
    }   catch (error) {
        next(error);
    }
});

export default router;