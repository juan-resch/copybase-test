import { useEffect, useRef, useState } from "react";
import { Button } from "./components";
import { ProcessedChartData, SpreadsheetData } from "./types";
import SpreadsheetService from "./services/Spreadsheet";
import { processSpreadsheetDataMonthly } from "./utils/processSpreadsheetData";
import { Graph } from "./components/Graph";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();
  const [data, setData] = useState<SpreadsheetData[]>();
  const [chartData, setChartData] = useState<ProcessedChartData[]>();

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

  useEffect(() => {
    sendFile();
  }, [file]);

  useEffect(() => {
    if (!data) return;
    const processedData = processSpreadsheetDataMonthly(data);
    setChartData(processedData);
  }, [data]);

  return (
    <div className="h-screen w-screen pt-20 bg-zinc-100 overflow-y-auto">
      <div className="fixed top-0 h-20 w-full bg-gradient-to-r from-black via-[#1a0438] to-black px-14 items-center flex justify-between">
        <span className="text-white font-bold text-xl">Copybase Test</span>
        <button className="text-white">Entrar</button>
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
    </div>
  );
}

export default App;
