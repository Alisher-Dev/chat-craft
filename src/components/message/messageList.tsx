import { Dispatch, FC, SetStateAction } from "react";
import { Avatars } from "../avatars";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { useAuthStore } from "@/store/auth";
import { Message } from "./message";
import { MessageWrapper } from "./messageWrapper";
import { useReplyStore } from "@/store/reply";

interface Props {
  messages?: IMessage[];
  className?: string;
  setPage?: Dispatch<SetStateAction<number>>;
}

export const MessageList: FC<Props> = ({ messages, className }) => {
  const { user } = useAuthStore();
  const { setReply } = useReplyStore();

  return (
    <div className={cn("flex flex-col gap-10 sm:gap-6 py-2 px-4 bg-muted", className)}>
      {messages?.map((message, index) => {
        const isMe = user?.id === message.user.id;

        return (
          <div
            className={cn("flex gap-3 sm:gap-6 items-end", isMe && "flex-row-reverse")}
            onDoubleClick={() => setReply(message)}
            data-index={index}
            key={message.id}
          >
            <Avatars index={message.user.avatar} />
            <MessageWrapper message={message} isMe={isMe}>
              <Message message={message} />
            </MessageWrapper>
          </div>
        );
      })}
    </div>
  );
};
