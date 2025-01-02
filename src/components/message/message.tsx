import { stiker } from "@/mock/stiker";
import { IMessage } from "@/types";
import { FC } from "react";
import { AudioPlayer } from "react-audio-play";

interface Props {
  message: IMessage;
}

export const Message: FC<Props> = ({ message }) => {
  if (message.type === "sticker") {
    const stickerUrl = stiker[+message.content.slice(1, 3)].url;
    return <img src={stickerUrl} className="block m-auto w-96 h-96" alt="stiker" />;
  }

  if (message.type === "voice") {
    return <AudioPlayer className="audio-player border-none w-[250px] sm:w-[400px] bg-accent" src={message.content} />;
  }

  if (message.type === "image") {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,1fr))]">
        {message.content.split(" ").map((url) => (
          <img src={url} alt={url} key={url} />
        ))}
      </div>
    );
  }

  return (
    <p className="gap-2 flex flex-wrap">
      {message.content.split(" ").map((word, index) => {
        const isUrl = word.startsWith("https://") || word.startsWith("http://");
        if (isUrl) {
          return (
            <a href={word} key={index} target="_blank" className="text-blue-500 underline break-all">
              {word}
            </a>
          );
        }

        return (
          <span key={index} className="break-all">
            {word}
          </span>
        );
      })}
    </p>
  );
};
