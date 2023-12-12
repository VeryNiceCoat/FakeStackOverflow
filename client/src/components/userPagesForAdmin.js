import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Question from './question'
import QuestionEditable from './question_editable'
import TagPage from './tag-page'
import AdminPage from './adminPage'
import AnswerTabEditable from './answer_editable'

function UserPagesForAdmin ({uid},props) {
    const [view, setView] = useState('questions')
    const [userQuestions, setUserQuestions] = useState([])
    const [userAnswers, setUserAnswers] = useState([])
    const [accountReputation, setAccountReputation] = useState(null)
    const [username, setUsername] = useState(null)
    const [date, setDate] = useState(null)
    const [showEditor, setShowEditor] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [editingTags, setEditingTags] = useState([])

    useEffect(() => {
        const userId = uid
        console.log('useeffect user id')
        console.log(userId)
        const fetchUserQuestions = async () => {
        try {
            
            const response = await Axios.get(
            `http://localhost:8000/users/${userId}/getAllQuestions`,
            { withCredentials: true }
            )
            console.log(response.data)
            setUserQuestions(response.data)
            console.log('fetch user q')
        } catch (error) {
            console.error('Error fetching questions', error)
        }
        }

        // const fetchUserAnswers = async() => {
        //     try {
        //         const ans = await Axios.get(
        //             `http://localhost:8000/users/getAllAnswers/${userId}`,
        //             { withCredentials: true }
        //         ) 
        //         setUserAnswers(ans.data)
        //         console.log('admin user answers')
        //         console.log(userAnswers)
        //         } catch (error) {
        //             console.error("error fetching user answers", error)
        //         }            
        // }

        console.log('running useEffect in userprofile')
        // fetchUserAnswers()
        fetchUserQuestions()

        const fetchAccountRepForAdmin = async () => {
        try {
            const res = await Axios.get(`http://localhost:8000/users/repAndDate/${userId}`, {
            withCredentials: true
            })
            const now = new Date()
            const differenceInMilliseconds = now - new Date(res.data.createdAt)
            const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60)

            const hoursAsString = differenceInHours.toFixed(0) + ' hours' // Convert to string with 2 decimal places
            setDate(hoursAsString)
            console.log('user rep')
            console.log(res.data)
            console.log(res.data.reputation)
            setAccountReputation(res.data.reputation)
            setUsername(res.data.name)
        } catch (error) {
            console.error('Error fetching account reputation', error)
        }
        }

        fetchAccountRepForAdmin()
    }, [showEditor,uid])

    useEffect(() => {
        const fetchTags = async (tagIds) => {
        try {
            let tags = [];
        
            for (let i = 0; i < tagIds.length; i++) {
            const response = await Axios.get(`http://localhost:8000/tags/${tagIds[i]}`, { withCredentials: true })
            tags.push(response.data.name)
            console.log("fetch tags data")
            console.log(response.data)
            }
        
            return tags;
        } catch (error) {
            console.error('Error fetching tags:', error);
            // Handle the error appropriately
        }
        }

        if (editingQuestion) {
        fetchTags(editingQuestion.tags).then(fetchedTags => {
            setEditingTags(fetchedTags || []); // Set the fetched tags or an empty array if none were fetched
        });
        }
        // console.log('edioting tags')
        // console.log(editingTags)
    }, [editingQuestion]);

    const handleShowEditor = question => {
        // console.log(showEditor)
        setShowEditor(true)
        setEditingQuestion(question)
        // console.log('editor:')
        // console.log(showEditor)
    }

    const renderUserQuestions = () => {
        if(userQuestions.length === 0){
            return <h2>User has no questions</h2>
        }
        return userQuestions.map(q => (
        <QuestionEditable
            key={q._id}
            onTitleClick={() => handleShowEditor(q)}
            onSearch={props.onSearch}
            onhandleTagonTagPageClicked={props.onhandleTagonTagPageClicked}
            question={q}
            onhandleTagOnMainPageClicked={props.onhandleTagOnMainPageClicked}
        />
        ))
    }

    const renderUserAnswers = () => {
        return userAnswers.map(ans => (
            <AnswerTabEditable
                key={ans._id}
                answer={ans}
            />
        ))
    }

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

    // const renderAdminPage = () => {
    //     return (
    //     <AdminPage/>
    //     )
    // }

    const handleSubmit = async event => {
        event.preventDefault()
        console.log(event.target.questionSummary.value,)
        console.log(event.target.questionBody.value)
        const questionID = editingQuestion._id
        try {
        await Axios.put(
            `http://localhost:8000/questions/editor/${questionID}`,
            {
            title: event.target.questionTitle.value,
            summary: event.target.questionSummary.value,
            text: event.target.questionBody.value
            
            },
            { withCredentials: true }
        ).then(setShowEditor(false))
        } catch (error) {
        window.alert("didnt edit right")
        }
    }

    const handleDeleteAccountClick = async () => {
        const userConfirmed = window.confirm('Delete account? Irreversible.')
        if (userConfirmed) {
            try {
            const userId = uid
            const res = await Axios.get(`http://localhost:8000/users/sendhimtotheshadowrealm/${userId}`, {
                withCredentials: true
            })
            if (res.data !== true) {
                throw new Error('Error With Deleting Account')
            }
            window.alert("CLICK")
            } catch (error) {
            window.alert(error.message)
            return
            }
            // User confirmed deletion
            // Add your logic here for what happens when the user confirms deletion

            console.log('Account deletion confirmed. Please log out and log in to see the changes')

        } else {
            // User cancelled deletion
            console.log('Account deletion cancelled')
        }
    }

    const handleQuestionDeletion = async () => {
        try {
            console.log(editingQuestion)
            const questionID = editingQuestion._id
            const res = await Axios.delete(
                `http://localhost:8000/questions/${questionID}/deleteQuestion`,
                {withCredentials : true}
            )
            if (res.data !== true) {
                throw new Error('Error With Deleting Question')
            }
            setShowEditor(false)
            } catch (error) {
            window.alert(error.message)
            return
            }
        }
    // const handleAdminPageClick = async () => {
    //     try {
    //     const response = await Axios.get(
    //         'http://localhost:8000/users/accountType',
    //         {
    //         withCredentials: true
    //         }
    //     )
    //     if (response.data !==  2) {
    //         throw new Error("You're not the Admin. Stay out of here")
    //     } 
    //     } catch (error){
    //         window.alert(error.message)
    //         return
    //     }

    //     setView('admin')
    // }
    const handleCancel = () => {
        setShowEditor(false)
        setEditingQuestion(null)
    }

    const renderEditor = () => {
        return (
        <div id='questionFormContainer'>
            <form id='questionForm' onSubmit={handleSubmit}>
            <button onClick={handleQuestionDeletion} type='button'>Delete This Question</button>
            <label htmlFor='questionTitle'>Question Title:*</label>
            <p>Limit titles to 100 characters or less.</p>
            <input
                type='text'
                id='questionTitle'
                name='questionTitle'
                defaultValue = {editingQuestion.title}
                pattern='.{0,100}'
                required
                title='Max 100 characters'
            />
            <label htmlFor='questionSummary'>Question Summary:*</label>
            <p>Limit Summaries to 140 characters or less</p>
            <input
                type='text'
                id='questionSummary'
                name='questionSummary'
                defaultValue={editingQuestion.summary}
                pattern='.{0,140}'
                required
                title='Max 140 Characters'
            />
            <label htmlFor='questionBody'>Question:*</label>
            <textarea
                id='questionBody'
                name='questionBody'
                defaultValue={editingQuestion.text}
                rows='4'
                required
            ></textarea>
            {/* <label htmlFor='formTags'>Tags:*</label> */}
            {/* <p>
                Add keywords separated by whitespace. 5 tags max, no more than 10
                characters per tag
            </p>
            <input
                type='text'
                id='formTags'
                name='formTags'
                defaultValue={editingTags.join(' ')}
                pattern='^(?:\b\w{1,10}\b\s*){1,5}$'
                required
                title='Up to 5 tags, each no longer than 10 characters, separated by whitespace.'
            /> */}
            {}
    
            <button type='submit'>Submit</button>
            </form>
        </div>
        )
    }

    // const accountReputation = async () => {
    //   try {
    //     const res = await Axios.get('http://localhost:8000/users/getSelf', {withCredentials: true})
    //     const temp = res.data;
    //     return <div>Account Reputation: {temp.reputation}</div>
    //   } catch (error) {
    //     return <div>Error With Getting Account Reputation</div>
    //   }
    // }


        return (
        <div id='profile-page'>
            <div className='pfp-sidebar'>
            <h3>User: {username}</h3>
            <ul>
                <li>
                    <button onClick={() => { setView('questions'); setShowEditor(false); }}>Questions</button>
                </li>
                <li>
                    <button onClick={() => { setView('tags'); setShowEditor(false); }}>Tags</button>
                </li>
                {/* <li>
                    <button onClick={() => { setView('answers'); setShowEditor(false); }}>Answers</button>
                </li> */}
                <li>
                    <button onClick={handleDeleteAccountClick}>Delete User</button>
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
            {showEditor ? renderEditor() : null}
            {view === 'questions' && !showEditor && renderUserQuestions()}
            {view === 'tags' && !showEditor && renderUserTags()}
            {/* {view === 'answers' && !showEditor && renderUserAnswers()} */}
            {/* {view === 'admin' && !showEditor && renderAdminPage()} */}
            </div>
        </div>
        )
    
    
}

export default UserPagesForAdmin
