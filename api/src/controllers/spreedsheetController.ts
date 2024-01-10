import { spreadsheetDataSchema } from "@/dto/SpreadsheetDto";
import SpreadsheetService from "@/services/SpreadsheetService";
import { SpreadsheetData } from "@/types";
import { Request, Response } from "express";
import path from "path";
import { ZodError } from "zod";
import fs from "fs";

export default {
  convertSpreadsheetToChartData: async (req: Request, res: Response) => {
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
        fs.unlinkSync(filePath);
        return res.status(415).json({ error: "Arquivo não suportado" });
      }

      spreadsheetDataSchema.parse(data[0]);

      const spreadsheetChartData = SpreadsheetService.processSpreadsheetChartDataMonthly(data);

      fs.unlinkSync(filePath);
      return res.status(200).json(spreadsheetChartData);
    } catch (error: any) {
      const isZodError = error instanceof ZodError;

      if (isZodError) {
        return res.status(415).json({ error: "Arquivo não suportado" });
      }

      return res.status(500).json({ error: "Server error" });
    }
  },
};
