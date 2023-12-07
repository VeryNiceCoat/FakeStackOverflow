import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import Question from './question'
import QuestionFormContainer from './questionFormContainer'
import AnswerForm from './answerForm'
import Post from './post'
import TagPage from './tag-page'
import UserProfile from './userProfile'

const QuestionView = props => {
  const [filter, setFilter] = useState('all')
  const [selectedQuestion, setSelectedQuestion] = useState(null) //for specific question when clicking on title
  const [questions, setQuestions] = useState([])
  const [allTags, setAllTags] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const questionsPerPage = 5

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await Axios.get('http://localhost:8000/questions/getNewest')
        setQuestions(response.data)
      } catch (error) {
        window.alert("Error getting questions from server")
        console.error('Error fetching questions', error)
      }
    }
    const fetchAllTags = async () => {
      try {
        const res = await Axios.get(`http://localhost:8000/tags`)
        setAllTags(res.data)
      } catch (error) {
        console.error('error fetching tags in components/tag-page.js', error)
      }
    }
    fetchQuestions()
    fetchAllTags()
  }, [props.showQForm, props.showAForm, props.showPostView, props.searchQuery])

  const handleShowPost = question => {
    incrementQuestionViews(question._id)
    props.setShowPostView(true)
    setSelectedQuestion(question)
  }

  function incrementQuestionViews (questionId) {
    Axios.put(`http://localhost:8000/questions/${questionId}/views`)
      .then(response => {})
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleAskQuestionClick = () => {
    props.setShowPostView(false)
    props.setShowTagsPage(false)
    props.setShowProfile(false)
    props.setShowAForm(false)
    props.setShowQForm(true)
  }

  const handleAnswerQuestionClick = () => {
    props.setShowPostView(false)
    props.setShowTagsPage(false)
    props.setShowProfile(false)
    props.setShowQForm(false)
    props.setShowAForm(true)
  }

  const handleQFormSubmit = () => {
    props.setShowQForm(false)
  }

  const handleAFormSubmit = () => {
    props.setShowAForm(false)
    props.setShowPostView(true)
  }

  const fetchAndSetQuestionsButton = async (sortType = 'newest') => {
    try {
      let sortedQuestions = []
      if (sortType === 'newest') {
        const response = await Axios.get(
          'http://localhost:8000/questions/getNewest',
          { withCredentials: true }
        )
        sortedQuestions = response.data
      } else if (sortType === 'active') {
        const response = await Axios.get(
          'http://localhost:8000/questions/getActive',
          { withCredentials: true }
        )
        sortedQuestions = response.data
      } else {
        const response = await Axios.get(
          'http://localhost:8000/questions/getUnanswered',
          { withCredentials: true }
        )
        sortedQuestions = response.data
      }
      setQuestions(sortedQuestions)
    } catch (error) {
      console.error(error)
      window.alert(
        'Error In Sorting Button Questions, refresh page ctrl shift r and try again'
      )
    }
  }

  const handleNewestClick = async () => {
    setFilter('newest')
    setCurrentPage(0)
    await fetchAndSetQuestionsButton('newest')
  }

  const handleActiveClick = async () => {
    setFilter('active')
    setCurrentPage(0)
    await fetchAndSetQuestionsButton('active')
  }

  const handleUnansweredClick = async () => {
    setFilter('unanswered')
    setCurrentPage(0)
    await fetchAndSetQuestionsButton('unanswered')
  }

  const renderQForm = () => {
    if (props.showQForm) {
      return <QuestionFormContainer onSubmit={handleQFormSubmit} />
    }
  }

  const renderAForm = () => {
    if (props.showAForm) {
      return (
        <AnswerForm question={selectedQuestion} onSubmit={handleAFormSubmit} />
      )
    }
  }

  const renderPost = () => {
    return (
      <Post
        question={selectedQuestion}
        onAskQuestion={handleAskQuestionClick}
        onAnswerQuestion={handleAnswerQuestionClick}
        onPost={props.showPostView}
      />
    )
  }

  const renderProfile = () => {
    return <UserProfile />
  }

  const renderQuestions = () => {
    const startIndex = currentPage * questionsPerPage
    // const selectedQuestions = questions.slice(startIndex, startIndex + questionsPerPage);
    // if (props.searchQuery !== )
    const filteredQuestions = questions.filter(q =>
      doesQuestionMatchSearchQuery(q, props.searchQuery)
    )
    //
    //
    getValue(filteredQuestions.length)
    const selectedQuestions = filteredQuestions.slice(
      startIndex,
      startIndex + questionsPerPage
    )
    const questionComponents = selectedQuestions.map(q => (
      <Question
        key={q._id}
        onTitleClick={() => handleShowPost(q)}
        onSearch={props.onSearch}
        onhandleTagonTagPageClicked={props.onhandleTagonTagPageClicked}
        question={q}
        onhandleTagOnMainPageClicked={props.onhandleTagOnMainPageClicked}
      />
    ))
    if (getValue() === 0) {
      return <div>No Questions Found</div>
    }
    return questionComponents
  }

  const doesQuestionMatchSearchQuery = (question, searchQuery) => {
    if (searchQuery === '') {
      return true
    }
    if (searchQuery.length <= 0) {
      return false
    }
    const { tags, text } = extractAndRemoveTags(searchQuery)
    const string = doesQuestionMatchString(question, text)
    const tag = doesQuestionMatchTags(question, tags)
    return string || tag
  }

  const doesQuestionMatchString = (question, searchString) => {
    if (
      searchString === undefined ||
      searchString === '' ||
      searchString.length <= 0
    ) {
      return false
    }
    const lowerCaseTitle = question.title.toLowerCase()
    const lowerCaseText = question.text.toLowerCase()
    const lowerCaseSummary = question.summary.toLowerCase()
    const lowerCaseSearchString = searchString.toLowerCase()
    return (
      lowerCaseTitle.includes(lowerCaseSearchString) ||
      lowerCaseText.includes(lowerCaseSearchString) ||
      lowerCaseSummary.includes(lowerCaseSearchString)
    )
  }

  const doesQuestionMatchTags = (question, searchIDs) => {
    if (searchIDs === undefined || searchIDs.length <= 0) {
      return false
    }
    const searchIDsTID = []
    for (let i = 0; i < searchIDs.length; i++) {
      searchIDsTID.push(getTagIDByTitle(searchIDs[i]))
    }
    if (
      searchIDsTID === undefined ||
      searchIDsTID.length <= 0 ||
      searchIDsTID[0] === undefined
    ) {
      return false
    }
    for (let i = 0; i < question.tags.length; i++) {
      for (let j = 0; j < searchIDsTID.length; j++) {
        if (question.tags[i].toLowerCase() === searchIDsTID[j].toLowerCase()) {
          return true
        }
      }
    }
    return false
  }

  const getTagIDByTitle = title => {
    for (let i = 0; i < allTags.length; i++) {
      if (title.toLowerCase() === allTags[i].name.toLowerCase()) {
        return allTags[i]._id
      }
    }
    return undefined
  }

  function extractAndRemoveTags (input) {
    const regex = /\[([^\]]+)\]/g
    const matches = input.match(regex)
    let tags = []
    let text = ''
    if (matches) {
      tags = matches.map(match => match.slice(1, -1))
      text = input.replace(regex, '')
    } else {
      text = input
    }
    if (text.endsWith(' ')) {
      text = text.slice(0, -1)
    }
    return { tags, text }
  }

  const renderTagsPage = () => {
    return (
      <TagPage
        questions={questions}
        onSearch={props.onSearch}
        handleTagonTagPageClicked={props.onhandleTagonTagPageClicked}
        onAskQuestion={handleAskQuestionClick}
      />
    )
  }

  function createValueRetainer () {
    let lastValue = null

    return function (newValue) {
      if (newValue !== undefined) {
        lastValue = newValue
      }
      return lastValue
    }
  }

  const getValue = createValueRetainer()

  if (props.showPostView) {
    return (
      <div className='question-view' id='question-viewID'>
        {renderPost()}
      </div>
    )
  } else if (props.showAForm) {
    return (
      <div className='question-view' id='question-viewID'>
        {renderAForm()}
      </div>
    )
  } else if (props.showQForm) {
    return (
      <div className='question-view' id='question-viewID'>
        {renderQForm()}
      </div>
    )
  } else if (props.showTagsPage) {
    return (
      <div className='question-view' id='question-viewID'>
        {props.showTagsPage && !props.showQForm && renderTagsPage()}
      </div>
    )
  } else if (props.showProfile) {
    return (
      <div className='question-view' id='question-viewID'>
        {renderProfile()}
      </div>
    )
  } else {
    const temp1 = props.showQForm && renderQForm()
    const temp2 = !props.showQForm && !props.showAForm && renderQuestions()
    return (
      <div className='question-view' id='question-viewID'>
        <div id='subheader'>
          <div className='left-side'>
            <h4>ALL QUESTIONS</h4>
            <h5 id='QuestionCount'>Question Count: {getValue()}</h5>
          </div>
          <div className='right-side'>
            <button
              id='askQuestionBtn'
              className='ask-q'
              onClick={handleAskQuestionClick}
            >
              Ask Question
            </button>
            <div className='q-filter'>
              <button
                className={filter === 'newest' ? 'active newest-q' : 'newest-q'}
                onClick={handleNewestClick}
              >
                Newest
              </button>
              <button
                className={filter === 'active' ? 'active active-q' : 'active-q'}
                onClick={handleActiveClick}
              >
                Active
              </button>
              <button
                className={
                  filter === 'unanswered'
                    ? 'active unanswered-q'
                    : 'unanswered-q'
                }
                onClick={handleUnansweredClick}
              >
                Unanswered
              </button>
            </div>
          </div>
        </div>
        <div id='submissions-view'>
          {temp1}
          <div
            className='scrollable-questions'
            style={{
              maxHeight: '600px', // Adjust the height as needed
              overflowY: 'auto' // Enables vertical scrolling
            }}
          >
            {temp2}
          </div>
          {}
          {}
        </div>
        <div className='footer'>
          <button
            onClick={() => {
              setCurrentPage(currentPage <= 0 ? 0 : currentPage - 1)
            }}
          >
            Prev
          </button>
          <button
            onClick={() => {
              setCurrentPage(
                (currentPage + 1) * questionsPerPage > getValue()
                  ? currentPage
                  : currentPage + 1
              )
            }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }
}

export default QuestionView
