import { useParams } from "react-router-dom";
import ChatInfo from "../components/chat/chatInfo";
import MessageList from "../components/chat/messageList";
import WriteMessage from "../components/chat/writeMessage";
import { FC, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { IMessage } from "@/types";
import ChatList from "../components/chat/chatList";
import { cn, isAtBottom, scrollToBottom } from "@/lib/utils";
import Sidebar from "../components/sidebar/sidebar";
import { useMessages } from "@/hooks/useMessage";
import { useModalStore } from "@/store/modal";

interface Props {
  unselected?: boolean;
}

const Chat: FC<Props> = ({ unselected }) => {
  const { id } = useParams();
  const { openModal, openModals } = useModalStore();
  const { isAuthenticated, user } = useAuthStore();
  const [newMessages, setNewMessages] = useState<IMessage[]>([]);
  const [page, setPage] = useState(1);
  const { data: messages } = useMessages(page, id);

  useEffect(() => {
    if (!isAuthenticated && !openModals.auth) {
      openModal("auth");
    }
  }, [isAuthenticated, openModals]);

  useEffect(() => {
    scrollToBottom("instant");
  }, [messages]);

  useEffect(() => {
    const isMe = newMessages[newMessages.length - 1]?.user?.id === user?.id;
    if (isMe || isAtBottom()) scrollToBottom();
  }, [newMessages]);

  const onChatChange = () => {
    setPage(1);
    setNewMessages([]);
  };

  useEffect(onChatChange, [id]);

  if (!messages) return null;

  return (
    <div className="flex relative">
      <aside
        className={cn(
          "sticky lg:basis-[400px] top-0 left-0 max-h-screen flex",
          unselected ? "basis-full" : "hidden lg:flex"
        )}
      >
        <Sidebar className="shrink-0 grow-0 basis-20 bg-accent" />
        <ChatList className="grow" lastNewMessage={newMessages[newMessages.length - 1]} />
      </aside>
      <main className={cn("bg-muted  relative grow", unselected && "flex items-center justify-center")}>
        {!unselected ? (
          <>
            <ChatInfo />
            <div className="min-h-[calc(100dvh-72px-56px)]">
              <MessageList messages={messages} />
              <MessageList messages={newMessages} />
            </div>
            <WriteMessage setNewMessages={setNewMessages} />
          </>
        ) : (
          <p className="bg-background hidden lg:inline-block p-2 font-bold">Выберите чат для общения</p>
        )}
      </main>
    </div>
  );
};

export default Chat;
