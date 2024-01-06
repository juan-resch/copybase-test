import { SpreadsheetData } from "@/types";

const mappedIndexToProperties = [
  "requency",
  "chargesCount",
  "recorrency",
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

    column.map(
      (value, index) => (rowData = { ...rowData, [mappedIndexToProperties[index]]: value })
    );

    goodData.push(rowData);
  }

  return goodData;
}
