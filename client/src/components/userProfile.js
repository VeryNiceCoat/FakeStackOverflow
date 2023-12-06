import React, { useState, useEffect } from 'react'


function UserProfile (props) {
    const [view, setView] = useState('questions')

    return (
        <div id='profile-page'>
            <div className='sidebar'>
                <ul>
                    <li><button onClick={() => setView('questions')}>Questions</button></li>
                    <li><button onClick={() => setView('tags')}>Tags</button></li>
                    <li><button onClick={() => setView('answers')}>Answers</button></li>
                </ul>
            </div>
        </div>
    )
}

export default UserProfile