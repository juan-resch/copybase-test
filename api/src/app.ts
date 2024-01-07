import { config } from "dotenv";
import cors from "cors";
import express from "express";
import spreadsheetRoutes from "@/routes/spreadsheetRoutes";
config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/spreadsheet", spreadsheetRoutes);

app.listen(PORT, () => {
  console.log(`server is runnning on port: ${PORT}`);
});
