import { useEffect, useRef, useState } from "react";
import { Block, Button, Graphs, HistoricMenu } from "./components";
import SpreadsheetService from "./services/Spreadsheet";
import { HistoricChartData, ProcessedChartData, SpreadsheetData } from "./types";
import { processSpreadsheetDataMonthly } from "./utils/processSpreadsheetData";
import findMaxChurnRate from "./utils/findMaxChurnRate";
import findMaxMRR from "./utils/findMaxMMR";
import findMinChurnRate from "./utils/findMinChurnRate";
import findMinMRR from "./utils/findMinMMR";
import toLocale from "./utils/toLocale";
import { Clock } from "lucide-react";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string>("");

  const [data, setData] = useState<SpreadsheetData[]>();
  const [chartData, setChartData] = useState<ProcessedChartData[]>();

  const [historic, setHistoric] = useState<HistoricChartData[]>([]);
  const [historicMenuIsOpen, setHistoricMenuIsOpen] = useState(false);

  const maxMMR = chartData ? findMaxMRR(chartData) : undefined;
  const minMMR = chartData ? findMinMRR(chartData) : undefined;
  const maxChurnRate = chartData ? findMaxChurnRate(chartData) : undefined;
  const minChurnRate = chartData ? findMinChurnRate(chartData) : undefined;

  const sendFile = async () => {
    if (!file) return;

    const { data, status, success, error } = await SpreadsheetService.convertSpreadsheetToJSON(
      file
    );

    if (error || !success) {
      if (status === 415) {
        setError(error);
      }
      return;
    }

    setData(data);
  };

  const resetHistoric = () => localStorage.setItem("historic", JSON.stringify([]));

  const loadHistoric = () => {
    const historicString = localStorage.getItem("historic");
    if (!historicString) {
      return resetHistoric();
    }
    const _historic = JSON.parse(historicString);

    setHistoric(_historic);
  };

  const saveLocalData = (historyChartData: HistoricChartData) => {
    try {
      let _historic: HistoricChartData[] = historic;

      _historic.push(historyChartData);

      localStorage.setItem("historic", JSON.stringify(_historic));
      setHistoric(_historic);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadHistoric();
  }, []);

  useEffect(() => {
    sendFile();
  }, [file]);

  useEffect(() => {
    if (!data) return;

    const processedData = processSpreadsheetDataMonthly(data);

    if (!processedData) return;

    saveLocalData({
      data: processedData,
      title: file?.name || new Date().toDateString(),
    });
    setChartData(processedData);
  }, [data]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError("");
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return (
    <div className="h-screen w-screen relative pt-20 bg-zinc-100 overflow-hidden">
      <div className="fixed top-0 h-20 w-full bg-gradient-to-r from-black via-[#1a0438] to-black px-14 items-center flex justify-between">
        <span className="text-white font-bold text-xl">Copybase Test</span>

        {historic && (
          <button
            onClick={() => setHistoricMenuIsOpen(true)}
            className="text-white flex gap-2 items-center"
          >
            Histórico <Clock />
          </button>
        )}
      </div>
      <div className="flex-col gap-4 w-full py-10 px-14 h-full flex items-center justify-center">
        {chartData && (
          <div className="flex flex-col w-full bg-zinc-200 rounded-lg border-zinc-300 border shadow-lg ">
            <Graphs data={chartData} />
            <div className="p-6 flex gap-x-8">
              {maxMMR && (
                <Block
                  title="Maior MMR"
                  value={`R$ ${toLocale(maxMMR.mrr)}`}
                  description={maxMMR.date.toLocaleDateString()}
                />
              )}
              {minMMR && (
                <Block
                  title="Menor MMR"
                  value={`R$ ${toLocale(minMMR.mrr)}`}
                  description={minMMR.date.toLocaleDateString()}
                />
              )}
              {maxChurnRate && (
                <Block
                  title="Maior Churn Rate"
                  value={`${toLocale(maxChurnRate.churnRate)}%`}
                  description={maxChurnRate.date.toLocaleDateString()}
                />
              )}
              {minChurnRate && (
                <Block
                  title="Menor Churn Rate"
                  value={`${toLocale(minChurnRate.churnRate)}%`}
                  description={minChurnRate.date.toLocaleDateString()}
                />
              )}
            </div>
          </div>
        )}
        <span className="text-red-600 font-medium">{error}</span>
        <Button
          onClick={() => {
            inputRef.current?.click();
          }}
          text={data ? "Selecionar outra planilha" : "Selecionar planilha"}
        />
        <input
          accept=".csv,.xlsx"
          type="file"
          onChange={(e) => {
            const files = e.target.files;

            if (files && files[0]) {
              return setFile(files[0]);
            }
          }}
          className="hidden"
          ref={inputRef}
        />
      </div>
      <HistoricMenu
        historicData={historic}
        open={historicMenuIsOpen}
        closeOnSelect
        onSelectItem={(item) => setChartData(item.data)}
        onClickClose={() => setHistoricMenuIsOpen(false)}
        onResetHistoric={() => {
          resetHistoric();
          setHistoric([]);
        }}
      />
    </div>
  );
}

export default App;
