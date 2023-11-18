import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import AnswerTab from './answer.js';
// import answers from '../../../server/models/answers.js';

/**
 * This is the actual post view, as in when a user clicks on a post, this will be what they see. 
 * Answer button functionality has not been implemented and idk how to do so. 
 */
const Post = ({question, onAnswerQuestion, onAskQuestion}, props) => {
  const [answersToBeLoaded, setAnswersToBeLoaded] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    /**
   * For all answers in that question, it gets all the answers and prints them
   * @returns Array of react components that seems to work well
   */
  useEffect(() => {
    const questionA = [undefined];
    // async function setQuestionsss () {
    //   try {
    //     const y = await Axios.get('http://localhost:8000/questions');
    //     const x = y.data;
    //     console.log("qUESTIONS");
    //     console.log(x);
    //     for (let i = 0; i < x.length; i++)
    //     {
    //       if (question._id === x[i]._id)
    //       {
    //         questionA[0] = x[i];
    //         break;
    //       }
    //     }
    //   }
    //   catch (error) {
    //     questionA[0] = question;
    //   }
    // }
    async function fetchAnswers() {
      try {
        const y = await Axios.get('http://localhost:8000/questions');
        const x = y.data;
        console.log("qUESTIONS");
        console.log(x);
        for (let i = 0; i < x.length; i++)
        {
          if (question._id === x[i]._id)
          {
            questionA[0] = x[i];
            break;
          }
        }
        console.log('getting all the answers')
        await Axios.get('http://localhost:8000/answers').then(function(res){
          const answersCollection = res.data;
          const relevantAnswers = answersCollection.filter(
            ans => questionA[0].answers.some(questionAnswer => questionAnswer === ans._id)
          );
          console.log('here are all the asnswers');
          console.log(answersCollection);
          const loadedAnswers = relevantAnswers.map(answer => (
            <AnswerTab key={answer._id} answer={answer} />
          ));
          console.log('here are the answers being loaded')
          console.log(loadedAnswers);
          setAnswersToBeLoaded(loadedAnswers);
          setIsLoading(false);
        })

      } catch (error) {
          console.error("error fetching answers in components/post.js", error);
      } 
    }
    // setQuestionsss();
    fetchAnswers();
    console.log("UseEffect");
  }, [props.showAForm, props.showPostView]);

  useEffect(() => {
    setIsLoading(false);
  }, [answersToBeLoaded])

  const loadingCheck = () => {
    if(isLoading) {
      return <div>Loading Answers...</div>
    } else {
      return(
        <div id="itemsAboveAnswerBtn">
          {answersToBeLoaded}
        </div>
      )
    }
  }



    return (
      <div id="postContainer">
        <div id="subheader">
          <h5 id="answerCount">{question.answers.length} answers</h5>
          <h4 id="questionTopic">{question.title}</h4>
          <button id="askQuestionBtn" className="ask-q" onClick={onAskQuestion}>Ask Question</button>
        </div>
        <div id="questionData">
          <div id="total-views">{question.views + 1} views</div>
          <div id="question-text">{convertStringToLinks(question.text)}</div>
          <div id="submitter-info">
              {question.asked_by} asked {formatQuestionDate(question.ask_date_time)}
          </div>
        </div>
        {loadingCheck()}
        <button id="answerQuestionBtn" className="answer-q" onClick={onAnswerQuestion}>Answer Question</button>
      </div>
    );
  // }
}

export default Post;



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

function convertStringToLinks(text) {
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


