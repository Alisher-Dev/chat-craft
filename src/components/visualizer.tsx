import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export const Waveform = ({ audioUrl }: { audioUrl: string }) => {
  const [audio, setAudio] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Создание объекта аудиофайла
  async function createAudioFile() {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      setAudio(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Ошибка при загрузке аудиофайла:", error);
    }
  }

  useEffect(() => {
    createAudioFile();
  }, [audioUrl]);

  useEffect(() => {
    if (audio && containerRef.current) {
      const waveSurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "rgb(124, 124, 124)",
        progressColor: "rgb(34,197,94)",
        barWidth: 2,
        cursorWidth: 1,
        height: 40,
        normalize: true,
      });

      waveSurfer.load(audio);

      waveSurfer.on("ready", () => {
        waveSurferRef.current = waveSurfer;
      });

      waveSurfer.on("play", () => setIsPlaying(true));
      waveSurfer.on("pause", () => setIsPlaying(false));

      return () => {
        waveSurfer.destroy();
      };
    }
  }, [audio]);

  const handlePlayPause = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={handlePlayPause} type="button">
        {isPlaying ? <Pause size="32px" /> : <Play size="32px" />}
      </button>
      <div className="min-w-40 xs:min-w-52" ref={containerRef} />
    </div>
  );
};
