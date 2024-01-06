import normalizeSpreadsheetData from "@/utils/normalizeSpreadsheetData";
import XLSX from "xlsx";

export default class SpreadsheetService {
  static convertToJson(spreadSheetFilePath: string) {
    try {
      const workbook = XLSX.readFile(spreadSheetFilePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let badData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const goodData = normalizeSpreadsheetData(badData);

      return goodData;
    } catch (error) {}
  }
}
