import { SpreadsheetData } from "@/types";
import convertExcelDateToJSDate from "./convertExcelDateToJSDate";

const mappedKeys = [
  "frequency",
  "chargesCount",
  "recurrence",
  "startDate",
  "status",
  "statusDate",
  "cancelDate",
  "value",
  "nextCicle",
  "assinantId",
];

export default function normalizeXLSXSpreadsheetData(data: any[][]) {
  const badData = data.slice(1, data.length);

  const goodData = [];

  for (let column of badData) {
    var rowData: SpreadsheetData = {} as SpreadsheetData;

    column.map((cell, index) => {
      const key = mappedKeys[index];

      if (key == "startDate" || key == "statusDate") {
        rowData[key] = convertExcelDateToJSDate(cell).toLocaleDateString();
      } else if (key == "cancelDate") {
        rowData[key] = convertExcelDateToJSDate(cell).toLocaleDateString();
      } else {
        rowData = { ...rowData, [mappedKeys[index]]: cell };
      }
    });

    goodData.push(rowData);
  }

  return goodData;
}
