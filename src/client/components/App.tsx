import React, { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const socketRef = useRef<Socket>();

  useEffect(() => {
    console.log("Connecting...");
    socketRef.current = io();
    socketRef.current.on("message", (payload) => {
      console.log("Received: " + payload);
      setMessages((prev) => [...prev, payload]);
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
    socketRef.current!.emit("message", text);
    // setMessages((prev) => [...prev, text]);
    setText("");
  };

  return (
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
      <ul>
        {messages.map((m, i) => {
          return <li key={i}>{m}</li>;
        })}
      </ul>
    </div>
  );
};

export default App;
