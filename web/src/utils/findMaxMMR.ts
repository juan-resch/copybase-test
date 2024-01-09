import { ProcessedChartData } from "../types";

export default function findMaxMRR(data: ProcessedChartData[]): ProcessedChartData {
  return data.reduce((maxMRRItem, currentItem) => {
    return currentItem.mrr > maxMRRItem.mrr ? currentItem : maxMRRItem;
  }, data[0]);
}
