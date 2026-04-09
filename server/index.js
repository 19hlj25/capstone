import usersRouter from "./routes/users.js";
import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
  
  });


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});