// import React, { useEffect, useState } from 'react';
// import Axios from 'axios';
import React from 'react';

/**
 * As far as I remember, this is under the question view tab, 
 * as in when someone clicks on a question and they are viewing it,
 * this shows the answer underneath that question
 */
  const AnswerTab = (props) => {

    // render() {
        // if (!answer || !model) return null;
        return (
            <div id="answerContainer">
                <div id="answer-text">
                  {LinkifyQuestionText(props.answer.text)}
                </div>
                <div id="submitter-info">
                    {props.answer.ans_by} replied {formatQuestionDate(props.answer.ans_date_time)}
                </div>
            </div>        
        );
    // }
}

/**
 * Converts a text with markdown-style links to React components
 * @param {string} text The text to be transformed
 * @returns An array of strings and React components
 */
function LinkifyQuestionText(text) {
  const regex = /\[(.*?)\]\((.*?)\)/g;
  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push the text between the last match and this match
    const textBeforeMatch = text.slice(lastIndex, match.index);
    if (textBeforeMatch) result.push(textBeforeMatch);

    // Create a React component for the link with blue color
    const linkElement = (
      <a href={match[2]} key={match.index} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
        {match[1]}
      </a>
    );
    result.push(linkElement);

    // Update lastIndex to the end of the current match
    lastIndex = regex.lastIndex;
  }

  // If there's any text left after the last match, add it as well
  const textAfterLastMatch = text.slice(lastIndex);
  if (textAfterLastMatch) result.push(textAfterLastMatch);

  return result;
}

export default AnswerTab;

function formatQuestionDate(askedDate) {
  const dateAskedDate = new Date(askedDate);
  const currentDate = new Date();
  const timeDifferenceInSeconds = Math.floor((currentDate - dateAskedDate) / 1000); 
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} seconds ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} minutes ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (currentDate.getFullYear() === dateAskedDate.getFullYear()) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[dateAskedDate.getMonth()];
    const day = dateAskedDate.getDate();
    return `${month} ${day} at ${formattedTime}`;
  } else {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[dateAskedDate.getMonth()];
    const day = dateAskedDate.getDate();
    const year = dateAskedDate.getFullYear();
    return `${month} ${day}, ${year} at ${formattedTime}`;
  }
}