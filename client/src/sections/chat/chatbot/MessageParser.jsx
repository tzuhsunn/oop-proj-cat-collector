/* eslint-disable react/prop-types, arrow-body-style */

import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message) {
      actions.searchAI(message);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;