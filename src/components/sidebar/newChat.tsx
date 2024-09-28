import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { useChatCreate } from "@/hooks/useChat";
import { useModalStore } from "@/store/modal";
import { useQueryClient } from "react-query";
import { CHAT_KEY } from "@/lib/constants";
import { FileUpload } from "@/lib/fileUpload";

export const NewChat = () => {
  const [name, setName] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const { closeModal } = useModalStore();
  const { mutate } = useChatCreate();
  const queryClient = useQueryClient();

  const createChat = () => {
    mutate(
      { img, name },
      {
        onSuccess: () => {
          toast.success("Группа успешно создана");
          closeModal("newchat");
          queryClient.refetchQueries(CHAT_KEY);
          setImg("");
          setName("");
        },
        onError: () => {
          toast.error("вы не загрузили файл или не задали имя");
        },
      }
    );
    console.log(img);
  };

  return (
    <>
      <ModalHeader>
        <h2>Создать группу</h2>
      </ModalHeader>

      <ModalContent className="flex flex-col gap-6">
        <Input placeholder="Имя группы" onChange={(e) => setName(e.target.value)} value={name} />
        <FileUpload uploadedFile={setImg} />
      </ModalContent>

      <ModalFooter>
        <Button onClick={createChat}>Создать</Button>
      </ModalFooter>
    </>
  );
};
