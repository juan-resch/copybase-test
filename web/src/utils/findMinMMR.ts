import { ProcessedChartData } from "../types";

export default function findMinMRR(data: ProcessedChartData[]): ProcessedChartData {
  return data.reduce((minMRRItem, currentItem) => {
    return currentItem.mrr < minMRRItem.mrr ? currentItem : minMRRItem;
  }, data[0]);
}
