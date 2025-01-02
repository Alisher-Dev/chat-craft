import { Button } from "@/components/ui/button";
import { onError } from "@/lib/onError";
import { fileUpload } from "@/services/fileService";
import { IUploadFile } from "@/types";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

interface PropsFile {
  setUrl: Dispatch<SetStateAction<string>>;
  clear?: boolean;
}

export const FileUpload = ({ setUrl, clear = false }: PropsFile) => {
  const [uploadFile, setUploadFile] = useState<IUploadFile | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await fileUpload(file);
        setUploadFile(data);
        setUrl(data.url);
      } catch (error) {
        if (error instanceof AxiosError) onError(error);
      }
    }
  }
  useEffect(() => {
    if (!clear) {
      setUploadFile(null);
    }
  }, [clear]);

  if (uploadFile) {
    return (
      <div className="relative">
        <Button variant="outline" onClick={() => setUploadFile(null)} className="absolute top-2 right-2">
          <Trash size={20} />
        </Button>
        <img src={uploadFile.url} alt={uploadFile.originalname} />
      </div>
    );
  }

  return (
    <>
      <Button className="p-12 relative border-2 border-dashed" variant="outline">
        <input
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={(e) => handleFile(e)}
          type="file"
        />
        <div className="absolute left-0 text-center right-0 z-0">
          <p className="text-lg">Загрузить файл</p>
          <p className="text-sm opacity-65 font-extralight">Переместите файл сюда</p>
        </div>
      </Button>
    </>
  );
};
