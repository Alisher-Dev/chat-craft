import { IMessage } from "@/types";
import { create } from "zustand";

interface IUseReplyStore {
  reply: IMessage | null;
  setReply: (replyn: IMessage | null) => void;
}

export const useReplyStore = create<IUseReplyStore>((set) => ({
  reply: null,
  setReply: (reply: IMessage | null) =>
    set(() => ({
      reply,
    })),
}));
