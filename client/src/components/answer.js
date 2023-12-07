import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import CommentTab from './comment'
import CommentForm from './commentForm'

const AnswerTab = props => {
  const [comments, setComments] = useState([])
  const [votes, setVotes] = useState(props.answer.votes)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await Axios.get('http://localhost:8000/comments')
      const allComments = res.data

      const filteredComments = allComments.filter(comment =>
        props.answer.comments.some(
          answerComment => answerComment === comment._id
        )
      )

      const answerA = [undefined]
      const resA = await Axios.get('http://localhost:8000/answers')
      const allAnswers = resA.data
      for (let i = 0; i < allAnswers.length; i++) {
        if (props.answer._id === allAnswers[i]._id) {
          answerA[0] = allAnswers[i]
          break
        }
      }
      setVotes(answerA[0].votes)
      setComments(filteredComments)
    }

    fetchComments()
  }, [props.answer.comments, comments])

  const renderComments = () => {
    return comments.map(comment => (
      <CommentTab key={comment._id} comment={comment} />
    ))
  }

  const handleUpvote = async () => {
    try {
      const response = await Axios.put(
        `http://localhost:8000/answers/${props.answer._id}/upVote`
      )
      setVotes(response.data.votes)
    } catch (error) {
      window.alert("Upvote Error", error.data.message)
      // console.error('Error during upvote', error)
    }
  }

  const handleDownvote = async () => {
    try {
      const response = await Axios.put(
        `http://localhost:8000/answers/${props.answer._id}/downVote`
      )
      setVotes(response.data.votes)
    } catch (error) {
      console.error('Error during upvote', error)
    }
  }

  const handleCommentSubmit = async commentText => {
    try {
      const temp = await Axios.put(
        `http://localhost:8000/comments/newComment/${commentText}`,
        {},
        {
          withCredentials: true
        }
      )
      const comment = temp.data
      const wait = await Axios.put(
        `http://localhost:8000/answers/${props.answer._id}/addComment/${comment._id}`,
        {},
        { withCredentials: true }
      )
      setIsLoading(false)
    } catch (error) {
      window.alert(error.response.data)
    }
    setShowCommentForm(false)
  }

  const handleCancelComment = () => {
    setShowCommentForm(false)
  }

  const handleCommentClick = () => {
    setShowCommentForm(true);
  }

  return (
    <div id='answerContainer'>
      <div id='main-answer'>
        <div className='vote-box'>
          Votes: {votes}
          <button onClick={handleUpvote}>Upvote</button>
          <button onClick={handleDownvote}>Downvote</button>
          <button onClick={handleCommentClick}>Add Comment</button>
        </div>
        <div id='answer-text'>{LinkifyQuestionText(props.answer.text)}</div>
        <div className='submitter-info'>
          {props.answer.username} replied{' '}
          {formatQuestionDate(props.answer.ans_date_time)}
          {}
        </div>
      </div>
      <div>
        {showCommentForm && (
          <CommentForm
            onSubmit={handleCommentSubmit}
            onCancel={handleCancelComment}
          />
        )}
      </div>
      <div id='answerComments'>
        Comments:
        {renderComments()}
      </div>
      <div>
        <button>Prev</button>
        <button>Next</button>
      </div>
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
