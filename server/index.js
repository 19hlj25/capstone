import express from "express";
import cors from "cors";
import businessesRouter from "./routes/businesses.js";
import db from "./db/client.js";
import usersRouter from "./routes/users.js";
import plansRouter from "./routes/plans.js";
import getUserFromToken from "./middleware/getUserFromToken.js";
import favoritesRouter from "./routes/favorites.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(getUserFromToken);


app.use("/api/businesses", businessesRouter);
app.use("/api/plans", plansRouter);
app.use("/api/users", usersRouter);
app.use("/api/favorites", favoritesRouter);


const PORT = process.env.PORT || 3001;



app.get("/", (req, res) => {
  res.send("Hello World");
});

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

