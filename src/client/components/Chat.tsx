import React, { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState<string>("");
  const [videoURL, setVideoURL] = useState<string>("");

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const socketRef = useRef<Socket>();

  useEffect(() => {
    console.log("Connecting...");
    socketRef.current = io();
    socketRef.current.on("message", (payload) => {
      console.log("Received: " + payload);
      setMessages((prev) => [...prev, payload]);
    });

    socketRef.current.on("videourl", (payload) => {
      console.log("Receive: " + payload);
      setVideoURL(payload);
    });

    socketRef.current.on("operation", (payload) => {
      console.log("Receive: " + payload);
      setPlayer((player) => {
        switch (payload) {
          case "play":
            player!.playVideo();
            break;
          case "pause":
            player!.pauseVideo();
            break;
        }
        return player;
      });
    });

    return () => {
      console.log("Disconnecting...");
      if (socketRef.current === undefined) {
        return;
      }
      socketRef.current.disconnect();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleButtonClick = () => {
    const regexp = /^https:\/\/www.youtube.com\//;
    if (regexp.test(text)) {
      const url = new URL(text);
      const params = new URLSearchParams(url.search);
      const videoID = params.get("v");

      socketRef.current!.emit("videourl", videoID);
    }

    socketRef.current!.emit("message", text);
    setText("");
  };

  const handlePlayButtonClick = () => {
    socketRef.current!.emit("operation", "play");
    console.log(player!.getCurrentTime());
  };

  const handlePauseButtonClick = () => {
    socketRef.current!.emit("operation", "pause");
  };

  const onReady = (e: { target: YouTubePlayer }) => {
    setPlayer(e.target);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        />
        <button disabled={!text} onClick={handleButtonClick}>
          送信
        </button>
      </div>
      {videoURL && <YouTube videoId={videoURL} onReady={onReady} />}
      <button disabled={!player} onClick={handlePlayButtonClick}>
        Play
      </button>
      <button disabled={!player} onClick={handlePauseButtonClick}>
        Pause
      </button>
      <ul>
        {messages.map((m, i) => {
          return <li key={i}>{m}</li>;
        })}
      </ul>
    </div>
  );
};

export default Chat;
