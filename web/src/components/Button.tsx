import { FC } from "react";

type ButtonProps = {
  onClick?: () => void;
  text: string;
};

export const Button: FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 active:opacity-75 duration-75 bg-black text-white rounded-md"
    >
      {text}
    </button>
  );
};
