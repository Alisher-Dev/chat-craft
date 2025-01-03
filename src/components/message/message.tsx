import { stiker } from "@/mock/stiker";
import { IMessage } from "@/types";
import { FC } from "react";
import { Waveform } from "../visualizer";

interface Props {
  message: IMessage;
}

function sendSticker(message: IMessage) {
  const stickerIndex = parseInt(message.content.slice(1, 3), 10);
  const stickerUrl = stiker[stickerIndex]?.url;

  if (!stickerUrl) {
    return <span className="text-red-500">Invalid sticker</span>;
  }

  return <img src={stickerUrl} className="block m-auto w-96 h-96" alt="sticker" />;
}

function sendAudio(message: IMessage) {
  return <Waveform audioUrl={message.content} />;
}

function sendImage(message: IMessage) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))]">
      {message.content.split(" ").map((url) => (
        <img className="max-h-[700px]" src={url} alt="Image content" key={url} />
      ))}
    </div>
  );
}

function sendMessage(message: IMessage) {
  return message.content.split(" ").map((word, index) => {
    const isUrl = word.startsWith("https://") || word.startsWith("http://");

    if (isUrl) {
      return (
        <a
          href={word}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-all"
        >
          {word}
        </a>
      );
    }

    return (
      <span key={index} className="break-all">
        {`${word} `}
      </span>
    );
  });
}

function renderMessageContent(message: IMessage) {
  switch (message.type) {
    case "image":
      return sendImage(message);
    case "sticker":
      return sendSticker(message);
    case "voice":
      return sendAudio(message);
    case "text":
      return sendMessage(message);
    default:
      return <span>тип сообщения не существует</span>;
  }
}

function messageReply(reply: IMessage) {
  switch (reply.type) {
    case "image":
      return "image";
    case "sticker":
      return "sticker";
    case "voice":
      return "audio";
    case "text":
      return reply.content;
    default:
      return "тип сообщения не существует";
  }
}

export const Message: FC<Props> = ({ message }) => {
  return (
    <p className="gap-2 flex flex-wrap flex-col">
      {message.reply && (
        <span className="p-2 border-primary bg-muted rounded-md shadow-md mt-1 border-l-2">
          {messageReply(message.reply)}
        </span>
      )}
      <p>{renderMessageContent(message)}</p>
    </p>
  );
};
