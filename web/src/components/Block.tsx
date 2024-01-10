import { FC } from "react";

type BlockProps = {
  title: string;
  value: string | number;
  description?: string;
};

export const Block: FC<BlockProps> = ({ title, value, description }) => {
  return (
    <div className="flex flex-col flex-1 gap-2 w-[240px] items-center p-4 rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-800 shadow-lg justify-center">
      <span className="font-bold text-white text-sm lg:lg xl:text-xl text-center">{title}</span>
      <span className="font-extrabold text-white lg:text-xl xl:text-2xl">{value}</span>
      <span className="font-medium text-white text-xs xl:text-sm">{description}</span>
    </div>
  );
};
