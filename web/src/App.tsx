import { useEffect, useRef, useState } from "react";
import { Button, HistoricMenu } from "./components";
import { Graph } from "./components/Graph";
import SpreadsheetService from "./services/Spreadsheet";
import { HistoricChartData, ProcessedChartData, SpreadsheetData } from "./types";
import { processSpreadsheetDataMonthly } from "./utils/processSpreadsheetData";
import { X } from "lucide-react";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();
  const [data, setData] = useState<SpreadsheetData[]>();
  const [chartData, setChartData] = useState<ProcessedChartData[]>();

  const [historic, setHistoric] = useState<HistoricChartData[]>([]);
  const [historicMenuIsOpen, setHistoricMenuIsOpen] = useState(false);

  const sendFile = async () => {
    if (!file) return;

    const { data, status, success, error } = await SpreadsheetService.convertSpreadsheetToJSON(
      file
    );

    if (error) {
      console.log(error, status);
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

  return (
    <div className="h-screen w-screen relative pt-20 bg-zinc-100 overflow-hidden">
      <div className="fixed top-0 h-20 w-full bg-gradient-to-r from-black via-[#1a0438] to-black px-14 items-center flex justify-between">
        <span className="text-white font-bold text-xl">Copybase Test</span>

        {historic && (
          <button onClick={() => setHistoricMenuIsOpen(true)} className="text-white">
            Ver histórico de planilhas
          </button>
        )}
      </div>
      <div className="flex-col gap-4 w-full py-10 px-14 h-full flex items-center justify-center">
        {chartData && (
          <div className="flex w-full bg-zinc-200 rounded-lg border-zinc-300 border shadow-lg ">
            <Graph data={chartData} />
          </div>
        )}
        <Button
          onClick={() => {
            inputRef.current?.click();
          }}
          text={data ? "Selecionar outra planilha" : "Selecionar planilha"}
        />
        <input
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
