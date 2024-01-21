/* eslint-disable react/prop-types, arrow-body-style */
import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {

  const searchAI = async (message) => {
    // const apiUrl = process.env.REACT_APP_CHAT_API_URL;
    // const apiUrl = "http://203.145.216.230:50642/cat-dog/invoke";
    const apiUrl = "https://tzuhsun.online/cat/query";
    console.log("apiUrl", apiUrl);    
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "input": message, config: {}, kwargs: {} }),
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const answer = data.output;
        console.log("answer", answer);
        const botMessage = createChatBotMessage(answer);

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      })
      .catch((error) => {
        console.error("Error fetching AI response:", error);
      });
  };


  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            searchAI,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;