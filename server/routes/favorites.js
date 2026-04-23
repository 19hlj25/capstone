import express from "express";
import {
    createFavorite,
    getFavoritesByUser,
    deleteFavorite,
} from "../db/queries/favorites.js";

const router = express.Router();

/**
 * Gets all favorites for the logged-in user.
 * Returns an array of favorited businesses
 */

router.get("/", async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).send({ error: "You must be logged in." });
        }

        const favorites = await getFavoritesByUser(req.user.id);
        res.send(favorites);
    } catch (error) {
        next(error);
    }
});

/**
 * Adds a biz to the logged-in user's favorites.
 * Requires a businessId in the request body.
 */
router.post("/", async (req, res, next) => {
    try{
        if (!req.user){
            return res.status(401).send({ error: "You must be logged in." });
        }

        const { businessId } = req.body;

        if(!businessId) {
            return res.status(400).send ({ error: "businessId is required." });
        } 
        
        const favorite = await createFavorite(req.user.id, businessId);
        res.status(201).send(favorite);
    }catch (error) {
        next(error);
    }

});

/**
 * Removes a business from the logged- in users favorites.
 * Requires a businessID in the route params.
 */
router.delete("/:businessId", async (req, res, next) => {
    try{
        if(!req.user) {
            return res.status(401).send({ error: "You must be logged in" });
        }

        const { businessId } = req.params;
        const deletedFavorite = await deleteFavorite(req.user.id, businessId);
        
        if (!deletedFavorite) {
            return res.status(404).send({error: "Favorite not found."});
        }

        res.send(deletedFavorites);
    } catch (error) {
        next(error);
    }
});

export default router;