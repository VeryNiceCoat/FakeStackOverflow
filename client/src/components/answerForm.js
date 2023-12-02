import React from 'react'
import Axios from 'axios'

const AnswerForm = ({ question, onSubmit }) => {
  const handleSubmit = async event => {
    event.preventDefault()
    const username = event.target.formUsername.value
    const answerBody = event.target.answerBody.value
    if (containsInvalidLink(answerBody)) {
      alert(
        'Please ensure that all hyperlinks are in the correct format and contain valid URLs.'
      )
      return
    }
    const newAnswerData = {
      text: answerBody,
      ans_by: username
    }
    const newAnswer = await Axios.post(
      'http://localhost:8000/answers',
      newAnswerData
    )
    const questionID = question._id
    await Axios.put(`http://localhost:8000/questions/${questionID}`, {
      answerID: newAnswer.data._id
    }).then(onSubmit())
  }

  return (
    <div id='answerFormContainer'>
      <form id='answerForm' onSubmit={handleSubmit}>
        <label htmlFor='formUsernameAnswer'>Username:*</label>
        <input
          type='text'
          id='formUsernameAnswer'
          name='formUsername'
          required
        />
        <label htmlFor='answerBody'>Answer:*</label>
        <textarea
          id='answerBody'
          name='answerBody'
          rows='4'
          required
        ></textarea>
        <button type='submit'>Post Answer</button>
      </form>
    </div>
  )
}

export default AnswerForm

function containsInvalidLink (text) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const linkText = match[1]
    const url = match[2]
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return true
    }
    if (!linkText.trim()) {
      return true
    }
  }
  return false
}
