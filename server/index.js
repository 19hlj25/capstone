import express from "express";
import cors from "cors";
import db from "./db/client.js";
import usersRouter from "./routes/users.js";
import plansRouter from "./routes/plans.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/plans", plansRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 3001;



app.get("/", (req, res) => {
  res.send("Hello World");
});

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});