import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Question from './question'
import TagPage from './tag-page'


function UserProfile (props) {
    const [view, setView] = useState('questions')
    const [userQuestions, setUserQuestions] = useState([])

    useEffect(() => {
        const fetchUserQuestions = async () => {
            try {
                const response = await Axios.get('http://localhost:8000/users/getAllQuestions',{withCredentials: true})
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

    const renderUserAnswers = () => {

    }

    const renderUserTags = () => {
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
                    <li><button onClick={() => setView('questions')}>Questions</button></li>
                    <li><button onClick={() => setView('tags')}>Tags</button></li>
                    <li><button onClick={() => setView('answers')}>Answers</button></li>
                </ul>
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