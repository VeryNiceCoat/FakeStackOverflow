import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import AnswerTab from './answer.js'
import CommentTab from './comment.js'

const Post = ({ question, onAnswerQuestion, onAskQuestion }, props) => {
  const [answersToBeLoaded, setAnswersToBeLoaded] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const answersPerPage = 5
  const [isLoading, setIsLoading] = useState(true)

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
      } catch (error) {}
    }
    fetchAnswers()
  }, [props.showAForm, props.showPostView])

  useEffect(() => {
    setIsLoading(false)
  }, [answersToBeLoaded])

  // const loadingCheck = () => {
  //   if (isLoading) {
  //     return <div>Loading Answers...</div>
  //   } else {
  //     return <div id='itemsAboveAnswerBtn'>{answersToBeLoaded}</div>
  //   }
  // }

  const paginatedAnswers = () => {
    const startIndex = currentPage * answersPerPage
    const selectedAnswers = answersToBeLoaded.slice(
      startIndex,
      startIndex + answersPerPage
    )
    return selectedAnswers
  }

  const handleNext = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePrev = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : 0))
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

  const renderComments = () => {
    return undefined
  }

  return (
    <div id='postContainer'>
      {/* {console.log("question comments", question.comments)} */}
      <div id='subheader'>
        <h5 id='answerCount'>{question.answers.length} answers</h5>
        <h5>Question Votes: {question.votes}</h5>
        <h4 id='questionTopic'>{question.title}</h4>
        <button>Upvote</button>
        <button>Downvote</button>
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
      {renderAnswers()}
      <div>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <div>
        Question Comments:{' '}
        {question.comments.length == 0 ? (
          <div>No Questions</div>
        ) : (
          renderComments()
        )}
        <div>
          <button>Prev</button>
          <button>Next</button>
        </div>
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
