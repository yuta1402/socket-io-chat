import React, { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState<string>("");
  const [videoURL, setVideoURL] = useState<string>("");

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

      socketRef.current!.emit(
        "videourl",
        "https://www.youtube.com/embed/" + videoID + "?autoplay=1"
      );
    }

    socketRef.current!.emit("message", text);
    setText("");
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
      {videoURL && (
        <iframe
          width="640"
          height="360"
          src={videoURL}
          allow="accelerometer; autoplay;"
        />
      )}
      <ul>
        {messages.map((m, i) => {
          return <li key={i}>{m}</li>;
        })}
      </ul>
    </div>
  );
};

export default Chat;
