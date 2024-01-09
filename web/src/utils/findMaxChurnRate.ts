import { ProcessedChartData } from "../types";

export default function findMaxChurnRate(data: ProcessedChartData[]): ProcessedChartData {
  return data.reduce((maxChurnRateItem, currentItem) => {
    return currentItem.churnRate > maxChurnRateItem.churnRate ? currentItem : maxChurnRateItem;
  }, data[0]);
}
