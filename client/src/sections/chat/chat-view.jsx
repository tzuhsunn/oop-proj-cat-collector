import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css'

import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

// ----------------------------------------------------------------------

export default function ChatView() {

  return (
      <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
  );
}
