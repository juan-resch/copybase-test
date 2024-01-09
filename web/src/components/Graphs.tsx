import { FC, useEffect, useRef, useState } from "react";
import { ProcessedChartData } from "../types";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import toLocale from "../utils/toLocale";

type GraphProps = {
  data: ProcessedChartData[];
};

export const Graphs: FC<GraphProps> = ({ data }) => {
  const canvasMRRRef = useRef<HTMLCanvasElement | null>(null);
  const canvasChurnRateRef = useRef<HTMLCanvasElement | null>(null);
  const chartMRRRef = useRef<Chart | null | undefined>(null);
  const chartChurnRateRef = useRef<Chart | null | undefined>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const renderGraph = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    graphData: any[],
    options: {
      title: string;
      labelPrefix?: string;
      labelSuffix?: string;
      color: string;
    }
  ) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (canvasRef === canvasMRRRef && chartMRRRef.current) {
      chartMRRRef.current.destroy();
    } else if (canvasRef === canvasChurnRateRef && chartChurnRateRef.current) {
      chartChurnRateRef.current.destroy();
    }

    const chartRef = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: options.title,
            borderColor: options.color,
            data: graphData,
            borderWidth: 4,
            hoverBorderColor: options.color,
            pointBackgroundColor: options.color,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "month",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return `${options.labelPrefix || ""} ${toLocale(value as number)} ${
                  options.labelSuffix || ""
                }`;
              },
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: "#fff",
            bodyColor: "#666",
            bodyFont: { weight: "bolder", size: 18 },
            padding: 10,
            borderColor: "#999",
            borderWidth: 0.5,
            displayColors: false,
            callbacks: {
              title: () => {
                return "";
              },
              label: (context) => {
                const dataPoint = graphData[context.dataIndex];
                return [
                  `${options.labelPrefix || ""} ${toLocale(dataPoint.y)} ${
                    options.labelSuffix || ""
                  }`,
                ];
              },
            },
          },
        },
      },
    });

    return chartRef;
  };

  useEffect(() => {
    Chart.defaults.font.family = "Montserrat";
    Chart.defaults.font.size = 14;

    if (canvasMRRRef.current) {
      chartMRRRef.current = renderGraph(
        canvasMRRRef,
        data.map((item) => ({ x: item.date, y: item.mrr })),
        {
          color: "#5682fa",
          title: "MRR",
          labelPrefix: "R$",
        }
      );
    }

    if (canvasChurnRateRef.current) {
      chartChurnRateRef.current = renderGraph(
        canvasChurnRateRef,
        data.map((item) => ({ x: item.date, y: item.churnRate })),
        {
          color: "#9945ff",
          title: "Churn Rate",
          labelSuffix: "%",
        }
      );
    }

    const updateContainerSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateContainerSize);

    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, [data]);

  useEffect(() => {
    if (chartMRRRef.current && chartChurnRateRef.current) {
      chartMRRRef.current.resize(0, 0);
      chartChurnRateRef.current.resize(0, 0);
    }
  }, [containerSize]);

  return (
    <div className="p-4 w-full h-full flex flex-col xl:flex-row gap-x-4">
      <div className="flex flex-1">
        <canvas ref={canvasMRRRef} />
      </div>
      <div className="flex flex-1">
        <canvas ref={canvasChurnRateRef} />
      </div>
    </div>
  );
};
