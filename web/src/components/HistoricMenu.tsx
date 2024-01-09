import { Trash, Trash2, X } from "lucide-react";
import { FC, useState } from "react";
import { HistoricChartData } from "../types";

type HistoricMenuProps = {
  open: boolean;
  historicData: HistoricChartData[];
  closeOnSelect: boolean;
  onSelectItem: (item: HistoricChartData) => void;
  onClickClose: () => void;
  onResetHistoric: () => void;
};

const MENU_WIDTH = 400;

export const HistoricMenu: FC<HistoricMenuProps> = ({
  open = false,
  closeOnSelect,
  historicData,
  onSelectItem = () => {},
  onClickClose = () => {},
  onResetHistoric = () => {},
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleDeleteHistoric = () => {
    if (!confirmReset) return setConfirmReset(true);

    onResetHistoric();
    setConfirmReset(false);
  };

  return (
    <div
      style={{
        right: open ? 0 : -MENU_WIDTH,
      }}
      className="flex flex-col overflow-hidden duration-150 w-[400px] rounded-l-2xl h-screen bg-gradient-to-br from-zinc-300 to-white border border-zinc-300 shadow-lg absolute top-0"
    >
      <div className="flex items-center justify-between w-full p-8">
        <span className="font-bold text-xl text-zinc-800">Histórico</span>
        <button onClick={onClickClose} className="duration-75 active:opacity-55">
          <X color="#888" />
        </button>
      </div>
      <div className="flex-1 flex-col border-t overflow-y-auto border-zinc-400">
        {historicData?.map((item, index) => (
          <button
            onClick={() => {
              if (closeOnSelect) onClickClose();
              onSelectItem(item);
            }}
            className="flex items-center border-b border-zinc-400 duration-150 hover:bg-zinc-300 justify-center w-full h-20 text-center text-black text-sm font-semibold"
          >
            <span>
              {index + 1} - {item.title}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={handleDeleteHistoric}
        className="flex w-full duration-150 hover:bg-zinc-300 bottom-0 h-16 rounded-bl-lg items-center justify-center gap-1 border-t border-t-zinc-300"
      >
        <span className="text-zinc-600 font-bold text-sm">
          {confirmReset ? "Clique novamente para confirmar" : "Apagar histórico"}
        </span>
        <Trash2 color="#555" size={20} />
      </button>
    </div>
  );
};
