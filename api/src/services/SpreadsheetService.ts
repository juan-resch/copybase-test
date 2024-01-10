import normalizeSpreadsheetData from "@/utils/normalizeXLSXSpreadsheetData";
import XLSX from "xlsx";

import csv from "csv-parser";
import fs from "fs";
import { ProcessedChartData, SpreadsheetData } from "@/types";
import stream from "stream";
import normalizeCSVSpreadsheetData from "@/utils/normalizeCSVSpreadsheetData";

export default class SpreadsheetService {
  static convertXLSXToJson(spreadSheetFilePath: string) {
    try {
      const workbook = XLSX.readFile(spreadSheetFilePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let badData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const goodData = normalizeSpreadsheetData(badData);

      return goodData;
    } catch (error) {
      throw error;
    }
  }
  static async convertCSVToJson(spreadSheetFilePath: string) {
    try {
      const csvData = fs.readFileSync(spreadSheetFilePath, "utf-8");

      const result: SpreadsheetData[] = [];
      const parseOptions = { headers: true, skipLines: 1 };

      const readableStream = stream.Readable.from(csvData);

      return new Promise<SpreadsheetData[]>((resolve, reject) => {
        readableStream
          .pipe(csv(parseOptions))
          .on("data", (data: any) => {
            result.push(normalizeCSVSpreadsheetData(data));
          })
          .on("end", () => {
            resolve(result);
          })
          .on("error", (error: any) => {
            console.error("Erro:", error.message);
            reject(error);
          });
      });
    } catch (error) {
      throw error;
    }
  }

  /*
  Fiquei um pouco confuso com a periodicidade das assinaturas e como exatamente 
  calcular MMR de Churn Rate de forma correta.

  Diante algumas dúvidas eu optei por diluiur as assinaturas anuais em mensais 
  (dividindo por 12) antes de calcular o MMR e Churn Rate e não tive sucesso.

  então deixei apenas assinaturas mensais.
*/
  static processSpreadsheetChartDataMonthly(data: SpreadsheetData[]) {
    data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const monthlySubscriptions = data.filter((d) => d.frequency == "Mensal");
    // const yearlySubscriptions = data.filter((d) => d.frequency == "Anual");

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

      const [month, year] = monthYear.split("/");

      processedChartData.push({
        date: new Date(`${year}-${month}`),
        mrr: mrr,
        churnRate,
      });
    });

    return processedChartData;
  }
}
