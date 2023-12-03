import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import CommentTab from './comment'

const AnswerTab = props => {
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const res = await Axios.get('http://localhost:8000/comments')
      const allComments = res.data

      const filteredComments = allComments.filter(comment =>
        props.answer.comments.some(
          answerComment => answerComment === comment._id
        )
      )

      setComments(filteredComments)
    }

    fetchComments()
  }, [props.answer.comments])

  const renderComments = () => {
    return comments.map(comment => (
      <CommentTab key={comment._id} comment={comment} />
    ))
  }

  return (
    <div id='answerContainer'>
      <div>
        Votes: {props.answer.votes}
        <button>Upvote</button>
        <button>Downvote</button>
      </div>
      <div id='answer-text'>{LinkifyQuestionText(props.answer.text)}</div>
      <div id='submitter-info'>
        {props.answer.username} replied{' '}
        {formatQuestionDate(props.answer.ans_date_time)}
        {}
      </div>
      <div>{renderComments()}</div>
    </div>
  )
}
export default AnswerTab

function LinkifyQuestionText (text) {
  const regex = /\[(.*?)\]\((.*?)\)/g
  let result = []
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    const textBeforeMatch = text.slice(lastIndex, match.index)
    if (textBeforeMatch) result.push(textBeforeMatch)
    const linkElement = (
      <a
        href={match[2]}
        key={match.index}
        target='_blank'
        rel='noopener noreferrer'
        style={{ color: 'blue' }}
      >
        {match[1]}
      </a>
    )
    result.push(linkElement)
    lastIndex = regex.lastIndex
  }
  const textAfterLastMatch = text.slice(lastIndex)
  if (textAfterLastMatch) result.push(textAfterLastMatch)
  return result
}

function formatQuestionDate (askedDate) {
  const dateAskedDate = new Date(askedDate)
  const currentDate = new Date()
  const timeDifferenceInSeconds = Math.floor(
    (currentDate - dateAskedDate) / 1000
  )
  const hours = currentDate.getHours().toString().padStart(2, '0')
  const minutes = currentDate.getMinutes().toString().padStart(2, '0')
  const formattedTime = `${hours}:${minutes}`
  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} seconds ago`
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} minutes ago`
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (currentDate.getFullYear() === dateAskedDate.getFullYear()) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const month = monthNames[dateAskedDate.getMonth()]
    const day = dateAskedDate.getDate()
    return `${month} ${day} at ${formattedTime}`
  } else {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const month = monthNames[dateAskedDate.getMonth()]
    const day = dateAskedDate.getDate()
    const year = dateAskedDate.getFullYear()
    return `${month} ${day}, ${year} at ${formattedTime}`
  }
}
