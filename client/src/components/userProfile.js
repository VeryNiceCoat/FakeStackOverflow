import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Question from './question'
import QuestionEditable from './question_editable'
import TagPage from './tag-page'
import AdminPage from './adminPage'

function UserProfile (props) {
  const [view, setView] = useState('questions')
  const [userQuestions, setUserQuestions] = useState([])
  const [accountReputation, setAccountReputation] = useState(null)
  const [date, setDate] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editingTags, setEditingTags] = useState([])

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await Axios.get(
          'http://localhost:8000/users/getAllQuestions',
          { withCredentials: true }
        )
        setUserQuestions(response.data)
        console.log('fetch user q')
      } catch (error) {
        console.error('Error fetching questions', error)
      }
    }

    console.log('running useEffect in userprofile')
    fetchUserQuestions()

    const fetchAccountReputation = async () => {
      try {
        const res = await Axios.get('http://localhost:8000/users/getSelf', {
          withCredentials: true
        })
        const now = new Date()
        const differenceInMilliseconds = now - new Date(res.data.createdAt)
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60)

        const hoursAsString = differenceInHours.toFixed(0) + ' hours' // Convert to string with 2 decimal places
        setDate(hoursAsString)

        setAccountReputation(res.data.reputation)
      } catch (error) {
        console.error('Error fetching account reputation', error)
      }
    }

    fetchAccountReputation()
  }, [showEditor])

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
    console.log('edioting tags')
    console.log(editingTags)
  }, [editingQuestion]);

  const handleShowEditor = question => {
    // console.log(showEditor)
    setShowEditor(true)
    setEditingQuestion(question)
    console.log('editor:')
    console.log(showEditor)
  }

  const renderUserQuestions = () => {
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

  // const renderAdminPage = () => {
  //   return (
  //     <AdminPage/>
  //   )
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

  const handleAdminPageClick = async () => {
    try {
      const response = await Axios.get(
        'http://localhost:8000/users/accountType',
        {
          withCredentials: true
        }
      )
      if (response.data !==  2) {
        throw new Error("You're not the Admin. Stay out of here")
      } 
    } catch (error){
        window.alert(error.message)
        return
    }

    setView('admin')
  }
  const handleCancel = () => {
    setShowEditor(false)
    setEditingQuestion(null)
  }

  const renderEditor = () => {
    return (
      <div id='questionFormContainer'>
        <form id='questionForm' onSubmit={handleSubmit}>
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
          <label htmlFor='formTags'>Tags:*</label>
          <p>
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
          />
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
          <h3>User: </h3>
          <ul>
            <li>
              <button onClick={() => { setView('questions'); setShowEditor(false); }}>Questions</button>
            </li>
            <li>
              <button onClick={() => { setView('tags'); setShowEditor(false); }}>Tags</button>
            </li>
            <li>
              <button onClick={() => { setView('answers'); setShowEditor(false); }}>Answers</button>
            </li>
            <li>
              <button onClick={() => {handleAdminPageClick(); setShowEditor(false);}}>AdminStuff</button>
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
          {view === 'answers' && !showEditor && renderUserAnswers()}
          {view === 'admin' && !showEditor && <AdminPage/>}
        </div>
      </div>
    )
  
  
}

export default UserProfile
