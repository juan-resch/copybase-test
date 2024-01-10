import upload from "@/middlewares/upload";
import { Router } from "express";
import spreedsheetController from "@/controllers/spreedsheetController";

const spreadsheetRoutes = Router();

spreadsheetRoutes.post(
  "/convertSpreadsheetToChartData/",
  upload.single("file"),
  spreedsheetController.convertSpreadsheetToChartData
);

export default spreadsheetRoutes;
