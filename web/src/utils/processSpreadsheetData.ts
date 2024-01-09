import { ProcessedChartData, SpreadsheetData } from "../types";

/*
Fiquei um pouco confuso com a periodicidade das assinaturas e como exatamente calcular MMR de Churn Rate de forma correta.
Diante algumas dúvidas eu optei por diluiur as assinaturas anuais em mensais (apenas dividindo por 12) antes de calcular o MMR e Churn Rate.
*/

export function processSpreadsheetDataMonthly(data: SpreadsheetData[]) {
  if (!data) return;

  data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const monthlySubscriptions = data.filter((d) => d.frequency == "Mensal");
  const yearlySubscriptions = data.filter((d) => d.frequency == "Anual");

  const processedChartData: ProcessedChartData[] = [];
  const mmrPerMonth: { [key: string]: number } = {};
  const activeClientsPerMonth: { [key: string]: number } = {};
  const cancelClientsPerMonth: { [key: string]: number } = {};

  monthlySubscriptions.forEach((item) => {
    const monthYear = new Date(item.startDate).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "numeric",
    });

    if (!mmrPerMonth[monthYear]) {
      mmrPerMonth[monthYear] = 0;
      activeClientsPerMonth[monthYear] = 0;
      cancelClientsPerMonth[monthYear] = 0;
    }

    activeClientsPerMonth[monthYear]++;

    if (item.status === "Cancelada" || item.status == "Trial cancelado") {
      cancelClientsPerMonth[monthYear]++;
    } else {
      mmrPerMonth[monthYear] += item.value;
    }
  });

  let subscriptionAmmount = 0;

  Object.entries(mmrPerMonth).forEach(([monthYear, mrr]) => {
    const activeClients = activeClientsPerMonth[monthYear];

    subscriptionAmmount += activeClients;

    const cancelClients = cancelClientsPerMonth[monthYear];

    const churnRate = (cancelClients ? cancelClients / subscriptionAmmount : 0) * 100;
    console.log("churnrate", churnRate);

    const [month, year] = monthYear.split("/");

    processedChartData.push({
      date: new Date(`${year}-${month}`),
      mrr: mrr,
      churnRate,
    });
  });

  return processedChartData;
}
