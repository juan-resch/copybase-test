import { useRef, useState } from "react";
import { Button } from "./components";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();

  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex items-center justify-center bg-zinc-300">
        <Button
          onClick={() => {
            inputRef.current?.click();
          }}
          text="Selecionar planilha"
        />
        <input
          type="file"
          onChange={(e) => {
            const files = e.target.files;

            if (files && files[0]) {
              console.log(files[0]);

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
