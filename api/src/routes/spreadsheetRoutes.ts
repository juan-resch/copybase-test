import upload from "@/middlewares/upload";
import { Router } from "express";
import spreedsheetController from "@/controllers/spreedsheetController";

const spreadsheetRoutes = Router();

spreadsheetRoutes.post(
  "/convertToJson/",
  upload.single("file"),
  spreedsheetController.convertToJson
);

export default spreadsheetRoutes;
