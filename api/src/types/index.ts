export type SpreadsheetData = {
  requency: "Yearly" | "Monthly";
  chargesCount: number;
  recorrency: number;
  startDate: number;
  status: "active" | "canceled" | "trialed";
  statusDate: number;
  cancelDate: number | null;
  value: number;
  nextCicle: string;
  assinantId: string;
};
