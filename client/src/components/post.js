import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import AnswerTab from './answer.js'
import CommentTab from './comment.js'
import CommentForm from './commentForm.js'
import TagForQuestionInMainPage from './tagForQuestionInMainPage'

const Post = ({ question, onAnswerQuestion, onAskQuestion }, props) => {
  const [answersToBeLoaded, setAnswersToBeLoaded] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const answersPerPage = 5
  const commentsPerPage = 3
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [commentPageNumber, setCommentPageNumber] = useState(0)
  const [votes, setVotes] = useState(question.votes)
  const [showCommentForm, setShowCommentForm] = useState(false)
  // const [tags, setTags] = useState([]);

  useEffect(() => {
    const questionA = [undefined]
    async function fetchAnswers () {
      try {
        const y = await Axios.get('http://localhost:8000/questions')
        const x = y.data
        for (let i = 0; i < x.length; i++) {
          if (question._id === x[i]._id) {
            questionA[0] = x[i]
            break
          }
        }
        setVotes(questionA[0].votes)
        await Axios.get('http://localhost:8000/answers').then(function (res) {
          const answersCollection = res.data
          const relevantAnswers = answersCollection.filter(ans =>
            questionA[0].answers.some(
              questionAnswer => questionAnswer === ans._id
            )
          )
          const loadedAnswers = relevantAnswers.map(answer => (
            <AnswerTab key={answer._id} answer={answer} />
          ))

          setAnswersToBeLoaded(loadedAnswers)
          setIsLoading(false)
        })

        const allComments = await Axios.get('http://localhost:8000/comments')
        const allCommentsData = allComments.data

        const relevantComments = allCommentsData.filter(comment =>
          questionA[0].comments.some(
            questionComment => questionComment === comment._id
          )
        )

        const loadedComments = relevantComments.map(comment => (
          <CommentTab key={comment._id} comment={comment} />
        ))

        setComments(loadedComments)
      } catch (error) {}
    }
    fetchAnswers()
  }, [props.showAForm, props.showPostView, currentPage, commentPageNumber])

  useEffect(() => {
    setIsLoading(false)
  }, [answersToBeLoaded])

  const handleUpvote = async () => {
    try {
      const response = await Axios.put(
        `http://localhost:8000/questions/${question._id}/upVote`,
        {},
        { withCredentials: true }
      )
      setVotes(response.data.votes)
    } catch (error) {
      // window.alert(error)
      window.alert(error.response.data)
      // window.alert(error.message);
    }
  }

  const handleDownvote = async () => {
    try {
      const response = await Axios.put(
        `http://localhost:8000/questions/${question._id}/downVote`,
        {},
        { withCredentials: true }
      )
      setVotes(response.data.votes)
    } catch (error) {
      window.alert(error.response.data)
      // console.error('Error during upvote', error)
    }
  }

  const paginatedAnswers = () => {
    const startIndex = currentPage * answersPerPage
    const selectedAnswers = answersToBeLoaded.slice(
      startIndex,
      startIndex + answersPerPage
    )
    return selectedAnswers
  }

  const handleNext = () => {
    setCurrentPage(prev =>
      (prev + 1) * 5 > answersToBeLoaded.length ? prev : prev + 1
    )
  }

  const handlePrev = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : 0))
  }

  const handleNextComment = () => {
    setCommentPageNumber(prev =>
      (prev + 1) * 3 > comments.length ? prev : prev + 1
    )
  }

  const handlePrevComment = () => {
    setCommentPageNumber(prev => (prev > 0 ? prev - 1 : 0))
  }

  const renderAnswers = () => {
    return (
      <div
        id='itemsAboveAnswerBtn'
        style={{
          maxHeight: '500px',
          overflowY: 'auto'
        }}
      >
        {paginatedAnswers()}
      </div>
    )
  }

  const paginatedComments = () => {
    const startIndex = commentPageNumber * commentsPerPage
    const selectedComments = comments.slice(
      startIndex,
      startIndex + commentsPerPage
    )
    return selectedComments
  }

  const renderComments = () => {
    if (question.comments.length == 0) {
      return <div>No Comments</div>
    } else {
      return paginatedComments()
    }
  }

  const handleAskCommentClick = () => {
    setShowCommentForm(!showCommentForm)
  }

  const handleCommentSubmit = async commentText => {
    try {
      if (commentText.length >= 140)
      {
        window.alert("Can't submit a comment with more than 140 characters")
        return;
      }
      const temp = await Axios.put(
        `http://localhost:8000/comments/newComment/${commentText}`,
        {},
        {
          withCredentials: true
        }
      )
      const comment = temp.data
      const updatedComments = [...comments, <CommentTab key={comment._id} comment={comment} />];
      setComments(updatedComments);
      const wait = await Axios.put(
        `http://localhost:8000/questions/${question._id}/addComment/${comment._id}`,
        {},
        { withCredentials: true }
      )
      const newQ = wait.data;
      // setComments(loadedComments)
    } catch (error) {
      window.alert(error.response.data)
    }
    setShowCommentForm(false)
  }

  const handleCancelComment = () => {
    setShowCommentForm(false)
  }

  return (
    <div id='postContainer'>
      <div id='subheader'>
        <h5 id='answerCount'>{question.answers.length} answers</h5>
        <h5>Question Votes: {votes}</h5>
        <h4 id='questionTopic'>{question.title}</h4>
        <button onClick={handleUpvote}>Upvote</button>
        <button onClick={handleDownvote}>Downvote</button>
        <button id='askQuestionBtn' className='ask-q' onClick={onAskQuestion}>
          Ask Question
        </button>
      </div>
      <div id='questionData'>
        <div id='total-views'>{question.views + 1} views</div>
        <div id='summary'>Question Summary: {question.summary}</div>
        <div id='question-text'>
          Question Text: {convertStringToLinks(question.text)}
        </div>
        <div id='submitter-info'>
          {question.username} asked {formatQuestionDate(question.ask_date_time)}
        </div>
      </div>
      <div>Tags:</div>
      {renderAnswers()}
      <div>
        <button onClick={handlePrev}>Prev Answers</button>
        <button onClick={handleNext}>Next Answers</button>
      </div>
      <div>
        Question Comments:
        {renderComments()}
        <div>
          <button onClick={handlePrevComment}>Prev Comments</button>
          <button onClick={handleNextComment}>Next Comments</button>
        </div>
        <div>
          <button onClick={handleAskCommentClick}>Add Comment</button>
        </div>
        {showCommentForm && (
          <CommentForm
            onSubmit={handleCommentSubmit}
            onCancel={handleCancelComment}
          />
        )}
      </div>
      <button
        id='answerQuestionBtn'
        className='answer-q'
        onClick={onAnswerQuestion}
      >
        Answer Question
      </button>
    </div>
  )
}

export default Post

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

function convertStringToLinks (text) {
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
