import { config } from "dotenv";
import express from "express";
config();

const PORT = process.env.PORT;

const app = express();

app.listen(PORT, () => {
  console.log(`server is runnning on port: ${PORT}`);
});
