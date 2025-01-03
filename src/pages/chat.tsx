import { useParams } from "react-router-dom";
import { ChatInfo } from "../components/chat/chatInfo";
import { MessageList } from "../components/message/messageList";
import { WriteMessage } from "../components/chat/writeMessage";
import { FC, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { IMessage } from "@/types";
import { ChatList } from "../components/chat/chatList";
import { cn, isInDeep, scrollToBottom } from "@/lib/utils";
import { useMessages } from "@/hooks/useMessage";
import { useModalStore } from "@/store/modal";
import { Sidebar } from "@/components/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useChatList } from "@/hooks/useChat";
import useMediaQuery from "@/hooks/useMediaQuery";

interface Props {
  unselected?: boolean;
}

const Chat: FC<Props> = ({ unselected }) => {
  const { id } = useParams();
  const { openModal, openModals } = useModalStore();
  const { isAuthenticated, user } = useAuthStore();
  const [newMessages, setNewMessages] = useState<IMessage[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const { data: messages } = useMessages(page, id);
  const { data: chatList } = useChatList();

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
    if (isMe || isInDeep()) scrollToBottom();
  }, [newMessages]);

  useEffect(() => {
    setPage(1);
    setNewMessages([]);
  }, [id]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex relative">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          minSize={isDesktop ? 30 : unselected ? 100 : 0}
          collapsible={isDesktop}
          collapsedSize={(100 * 177) / window.innerWidth}
          maxSize={isDesktop ? 60 : unselected ? 100 : 0}
          onResize={setSize}
        >
          <aside className="flex fixed top-0 left-0 h-screen" style={{ width: size + "%" }}>
            <Sidebar className="shrink-0 grow-0 basis-20 bg-accent" />
            <div className="flex flex-col w-full">
              <ChatList chatList={chatList} className="grow" lastNewMessage={newMessages[newMessages.length - 1]} />
            </div>
          </aside>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <main
            className={cn("bg-muted relative grow", unselected && "flex items-center justify-center min-h-[100dvh]")}
          >
            {!unselected ? (
              <>
                <ChatInfo />
                <div className="min-h-[calc(100dvh-72px-56px)] overflow-auto">
                  <MessageList messages={messages} />
                  <MessageList messages={newMessages} />
                </div>
                <WriteMessage setNewMessages={setNewMessages} />
              </>
            ) : (
              <p className="bg-background hidden lg:inline-block p-2 font-bold">Выберите чат для общения</p>
            )}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
