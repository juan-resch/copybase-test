import { SpreadsheetData } from "@/types";

const mappedIndexToProperties = [
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

export default function normalizeSpreadsheetData(data: any[][]) {
  const badData = data.slice(1, data.length);

  const goodData = [];

  for (let column of badData) {
    var rowData: SpreadsheetData = {} as SpreadsheetData;

    column.map((cell, index) => (rowData = { ...rowData, [mappedIndexToProperties[index]]: cell }));

    goodData.push(rowData);
  }

  return goodData;
}
