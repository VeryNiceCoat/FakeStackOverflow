import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Question from './question'
import TagPage from './tag-page'

function UserProfile (props) {
  const [view, setView] = useState('questions')
  const [userQuestions, setUserQuestions] = useState([])
  const [accountReputation, setAccountReputation] = useState(null)
  const [date, setDate] = useState(null)

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await Axios.get(
          'http://localhost:8000/users/getAllQuestions',
          { withCredentials: true }
        )
        setUserQuestions(response.data)
      } catch (error) {
        console.error('Error fetching questions', error)
      }
    }

    fetchUserQuestions()
  }, [])

  const renderUserQuestions = () => {
    return userQuestions.map(q => (
      <Question
        key={q._id}
        onTitleClick={() => props.handleShowPost(q)}
        onSearch={props.onSearch}
        onhandleTagonTagPageClicked={props.onhandleTagonTagPageClicked}
        question={q}
        onhandleTagOnMainPageClicked={props.onhandleTagOnMainPageClicked}
      />
    ))
  }

  const renderUserAnswers = () => {}

  const renderUserTags = () => {
    const tags = []
    for (let i = 0; i < userQuestions.length; i++) {
      for (let z = 0; z < userQuestions[i].tags.length; z++) {
        tags.push(userQuestions[i].tags[z])
      }
    }
    const uniqTags = [...new Set(tags)]
    return (
      <TagPage
        questions={userQuestions}
        onSearch={props.onSearch}
        handleTagonTagPageClicked={props.onhandleTagonTagPageClicked}
        onAskQuestion={props.handleAskQuestionClick}
      />
    )
  }

  return (
    <div id='profile-page'>
      <div className='pfp-sidebar'>
        <h3>User: </h3>
        <ul>
          <li>
            <button onClick={() => setView('questions')}>Questions</button>
          </li>
          <li>
            <button onClick={() => setView('tags')}>Tags</button>
          </li>
          <li>
            <button onClick={() => setView('answers')}>Answers</button>
          </li>
        </ul>
        <div>
          {accountReputation !== null ? (
            <div>Account Reputation: {accountReputation}</div>
          ) : (
            <div>Loading Reputation...</div>
          )}
        </div>
        <div>
          {date !== null ? (
            <div>Time since creation: {date}</div>
          ) : (
            <div>Loading time...</div>
          )}
        </div>
      </div>
      <div className='user-submissions'>
        {/* {console.log(view)} */}
        {view === 'questions' && renderUserQuestions()}
        {view === 'tags' && renderUserTags()}
        {view === 'answers' && renderUserAnswers()}
      </div>
    </div>
  )
}

export default UserProfile
