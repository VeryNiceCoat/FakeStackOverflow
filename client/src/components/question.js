import React, {useState, useEffect} from 'react';
import TagForQuestionInMainPage from './tagForQuestionInMainPage';
import Axios from 'axios';
// import Post from './post.js'
// import Query from './objectForSearching';


/**
 * The actual form of a question on the main page
 */
const Question = ({question, onTitleClick, onhandleTagOnMainPageClicked}, props) => {
    const [selectedTags, setSelectedTags] = useState([])
    useEffect(() => {
      const fetchRelevantTags = async() => {
        try{
          const res = 
            await Axios.get(`http://localhost:8000/tags`);
            const relevantTags = res.data.filter(tag => 
                question.tags.some(questionTags => questionTags === tag._id));
            //after filtering, thse are the tags that are connected to each question
            setSelectedTags(relevantTags);

        } catch (error) {
          console.error("error fetching tags in components/question.js", error)
        }
      }
      fetchRelevantTags();
    }, [question.tags]);

  const handleTitleClick = () => {onTitleClick();}

  const formatDate = (askedDate) => {
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

  return (
    <div id="questionContainer">
      <div id="view-stats">
        <div id="total-answers">{question.answers.length} answers</div>
        <div id="total-views">{question.views} views</div>
      </div>
      <div id="title-and-tags">
        <div id="question-title" onClick={handleTitleClick}>{question.title}</div>
        <div id="appendOtherTagsHere">
          {selectedTags.map(tag => (
            <TagForQuestionInMainPage key={tag._id} onSearch={props.onSearch} tag={tag} onhandleTagOnMainPageClicked={onhandleTagOnMainPageClicked}/>
          ))}
        </div>
      </div>
      <div id="submitter-info">
        {question.asked_by} asked {formatDate(question.ask_date_time)}
      </div>
    </div>
  );
}

export default Question;