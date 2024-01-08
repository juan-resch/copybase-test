import normalizeSpreadsheetData from "@/utils/normalizeXLSXSpreadsheetData";
import XLSX from "xlsx";

import csv from "csv-parser";
import fs from "fs";
import { SpreadsheetData } from "@/types";
import stream from "stream";
import normalizeCSVSpreadsheetData from "@/utils/normalizeCSVSpreadsheetData";

export default class SpreadsheetService {
  static convertXLSXToJson(spreadSheetFilePath: string) {
    try {
      const workbook = XLSX.readFile(spreadSheetFilePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let badData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const goodData = normalizeSpreadsheetData(badData);

      return goodData;
    } catch (error) {
      throw error;
    }
  }
  static async convertCSVToJson(spreadSheetFilePath: string) {
    try {
      const csvData = fs.readFileSync(spreadSheetFilePath, "utf-8");

      const result: SpreadsheetData[] = [];
      const parseOptions = { headers: true, skipLines: 1 };

      const readableStream = stream.Readable.from(csvData);

      return new Promise<SpreadsheetData[]>((resolve, reject) => {
        readableStream
          .pipe(csv(parseOptions))
          .on("data", (data: any) => {
            result.push(normalizeCSVSpreadsheetData(data));
          })
          .on("end", () => {
            resolve(result);
          })
          .on("error", (error: any) => {
            console.error("Erro:", error.message);
            reject(error);
          });
      });
    } catch (error) {
      throw error;
    }
  }
}
