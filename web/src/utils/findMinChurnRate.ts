import { ProcessedChartData } from "../types";

export default function findMinChurnRate(data: ProcessedChartData[]): ProcessedChartData {
  return data.reduce((minChurnRateItem, currentItem) => {
    return currentItem.churnRate < minChurnRateItem.churnRate ? currentItem : minChurnRateItem;
  }, data[0]);
}
