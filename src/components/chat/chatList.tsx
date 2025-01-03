import { cn, cutTextOnLimit, getLastMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { IChat, IMessage } from "@/types";
import { Dispatch, FC, SetStateAction } from "react";
import { Link, useParams } from "react-router-dom";
import notImage from "../../assets/Modicon_No_Chat_Reports.webp";
import { FolderSearch } from "lucide-react";

interface Props {
  lastNewMessage?: IMessage;
  className?: string;
  setSize?: Dispatch<SetStateAction<boolean>>;
  chatList?: IChat[];
}

export const ChatList: FC<Props> = ({ chatList, lastNewMessage, className }) => {
  const { id } = useParams();
  const { user } = useAuthStore();

  if (!chatList?.length) {
    return (
      <h4 className={cn("text-muted-foreground flex items-center flex-col text-center text-lg mt-5", className)}>
        <FolderSearch size="40" /> <span>У вас нету чатов</span>
      </h4>
    );
  }

  return (
    <div className={cn("flex flex-col overflow-auto", className)}>
      {chatList.map((chat) => {
        const lastMessage = lastNewMessage?.chat.id === chat.id ? lastNewMessage : chat.messages[0];

        return (
          <Link
            to={`/chat/${chat.id}`}
            key={chat.id}
            className={cn(
              "flex py-5 px-3 gap-3 items-center hover:bg-muted transition-all",
              id === chat.id && "bg-muted"
            )}
          >
            <img
              src={chat.img || notImage}
              className={cn("min-w-16 w-16 h-16 rounded-md object-cover transition-all")}
              alt="chat icon"
            />
            <div>
              <p className="font-semibold mb-1">{cutTextOnLimit(chat.name, 20)}</p>
              {lastMessage && (
                <p className="text-muted-foreground text-xs mt-2 flex item-center">
                  {getLastMessage(lastMessage, user)}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
