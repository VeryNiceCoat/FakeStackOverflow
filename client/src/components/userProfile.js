import React, { useState, useEffect } from 'react'


function UserProfile (props) {
    const [view, setView] = useState('questions')

    const renderUserQuestions = () => {
        
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

            </div>
        </div>
    )
}

export default UserProfile