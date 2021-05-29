import React, { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Chat from "./Chat";

const App = () => {
  return (
    <div>
      <Chat />
    </div>
  );
};

export default App;
