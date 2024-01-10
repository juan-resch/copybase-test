/*
  Fiquei um pouco confuso com a periodicidade das assinaturas e como exatamente 
  calcular MMR de Churn Rate de forma correta.

  Diante algumas dúvidas eu optei por diluiur as assinaturas anuais em mensais 
  (dividindo por 12) antes de calcular o MMR e Churn Rate e não tive sucesso.

  então deixei apenas assinaturas mensais.
*/

import { ProcessedChartData, SpreadsheetData } from "@/types";

export function processSpreadsheetDataMonthly(data: SpreadsheetData[]) {}
