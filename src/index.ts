import express from "express";
import { config } from "./config/config";
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
