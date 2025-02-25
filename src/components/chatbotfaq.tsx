"use client";

import React from "react";
import ChatBot, { Flow } from "react-chatbotify";

interface ChatBotComponentProps {
  flow: Flow;
}

const themes = [
  { id: "cyborg", version: "0.1.0" },
];

const ChatBotComponent: React.FC<ChatBotComponentProps> = ({ flow }) => {
  return (
    <ChatBot
      settings={{
        tooltip: { text: "Ask questions!" },
        general: { embedded: false },
        chatHistory: { storageKey: "tenant_complaint_form" },
        footer: { text: "" },
      }}
      themes={themes}
      flow={flow}
    />
  );
};

export default ChatBotComponent;
