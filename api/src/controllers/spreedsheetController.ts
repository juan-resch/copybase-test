import SpreadsheetService from "@/services/SpreadsheetService";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export default {
  convertToJson: async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) return res.status(404).json({ message: "File not found" });

      const filePath = path.join(__dirname, "..", "temp", file.filename);

      const data = SpreadsheetService.convertToJson(filePath);

      fs.unlinkSync(filePath);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  },
};
