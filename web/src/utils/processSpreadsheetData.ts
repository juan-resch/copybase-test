import { ProcessedChartData, SpreadsheetData } from "../types";

export function processSpreadsheetDataMonthly(data: SpreadsheetData[]) {
  if (!data) return;

  data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const filteredData = data.filter((d) => d.frequency === "Mensal");
  const processedChartData: ProcessedChartData[] = [];
  const mmrPerMonth: { [key: string]: number } = {};
  const activeClientsPerMonth: { [key: string]: number } = {};
  const cancelClientsPerMonth: { [key: string]: number } = {};

  filteredData.forEach((item) => {
    const monthYear = new Date(item.startDate).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "numeric",
    });

    if (!mmrPerMonth[monthYear]) {
      mmrPerMonth[monthYear] = 0;
      activeClientsPerMonth[monthYear] = 0;
      cancelClientsPerMonth[monthYear] = 0;
    }

    mmrPerMonth[monthYear] += item.value;

    activeClientsPerMonth[monthYear]++;

    if (item.status === "Cancelada" && item.cancelDate) {
      cancelClientsPerMonth[monthYear]++;
    }
  });

  Object.entries(mmrPerMonth).forEach(([monthYear, mrr]) => {
    const activeClients = activeClientsPerMonth[monthYear];
    const cancelClients = cancelClientsPerMonth[monthYear];

    const churnRate = (activeClients > 0 ? cancelClients / activeClients : 0) * 100;

    const [month, year] = monthYear.split("/");

    processedChartData.push({
      date: new Date(`${year}-${month}`),
      mrr: mrr,
      churnRate,
    });
  });

  return processedChartData;
}
