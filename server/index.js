import express from "express";

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World");
  
  });
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});