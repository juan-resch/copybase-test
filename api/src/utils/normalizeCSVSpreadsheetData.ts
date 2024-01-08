import { SpreadsheetData } from "@/types";

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

export default function normalizeCSVSpreadsheetData(uniqueBadData: any) {
  let uniqueGoodData: SpreadsheetData = {} as SpreadsheetData;

  Object.keys(uniqueBadData).forEach((key, index) => {
    uniqueGoodData = {
      ...uniqueGoodData,
      [mappedKeys[index]]: uniqueBadData[key],
    };
  });

  Object.keys(uniqueGoodData).map((key) => {
    if (key == "chargesCount" || key == "recurrence") {
      uniqueGoodData[key] = parseInt(uniqueGoodData[key] as any);
    }
    if (key == "value") {
      const fixedNumber = uniqueGoodData[key].toString().replace(",", ".");

      uniqueGoodData[key] = parseFloat(fixedNumber);
    }
    if (key == "startDate" || key == "statusDate") {
      uniqueGoodData[key] = new Date(uniqueGoodData[key]).toLocaleDateString();
    }
  });

  return uniqueGoodData;
}
