import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'CatCat';

const config = {
  initialMessages: [createChatBotMessage(`Hi I'm CatCat can recommend cute cat for you :)`)],
  botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
};

export default config;