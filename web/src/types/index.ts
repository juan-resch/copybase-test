export type SpreadsheetData = {
  frequency: "Anual" | "Mensal";
  chargesCount: number;
  recurrence: number;
  startDate: number;
  status: "Ativa" | "Cancelada" | "Trial cancelado" | "Upgrade";
  statusDate: number;
  cancelDate: number | null;
  value: number;
  nextCicle: string;
  assinantId: string;
};

export type ProcessedChartData = {
  date: Date;
  mrr: number;
  churnRate: number;
};
