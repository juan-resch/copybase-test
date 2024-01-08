export type SpreadsheetData = {
  frequency: "Anual" | "Mensal";
  chargesCount: number;
  recurrence: number;
  startDate: string;
  status: "Ativa" | "Cancelada" | "Trial cancelado" | "Upgrade";
  statusDate: string;
  cancelDate: number | null;
  value: number;
  nextCicle: string;
  assinantId: string;
};
