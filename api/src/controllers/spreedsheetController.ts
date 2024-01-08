import SpreadsheetService from "@/services/SpreadsheetService";
import { SpreadsheetData } from "@/types";
import { Request, Response } from "express";
import path from "path";

export default {
  convertToJson: async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) return res.status(404).json({ message: "File not found" });

      const fileExtension = path.extname(file.filename);
      const filePath = path.join(__dirname, "..", "temp", file.filename);

      let data: SpreadsheetData[];

      if (fileExtension == ".csv") {
        data = await SpreadsheetService.convertCSVToJson(filePath);
      } else if (fileExtension == ".xlsx") {
        data = SpreadsheetService.convertXLSXToJson(filePath);
      } else {
        return res.status(400).json({ error: "File not supported" });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  },
};
