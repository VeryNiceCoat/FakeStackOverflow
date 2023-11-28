import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import Question from './question'
import QuestionFormContainer from './questionFormContainer'
import AnswerForm from './answerForm'
import Post from './post'
import TagPage from './tag-page'

const QuestionView = props => {
  const [filter, setFilter] = useState('all')
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [questions, setQuestions] = useState([])
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await Axios.get('http://localhost:8000/questions')
        setQuestions(response.data)
      } catch (error) {
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
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleAskQuestionClick = () => {
    props.setShowPostView(false)
    props.setShowTagsPage(false)
    props.setShowAForm(false)
    props.setShowQForm(true)
  }

  const handleAnswerQuestionClick = () => {
    props.setShowPostView(false)
    props.setShowTagsPage(false)
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
      const response = await Axios.get('http://localhost:8000/questions')
      let sortedQuestions = response.data

      if (sortType === 'newest') {
        sortedQuestions = sortedQuestions.sort(
          (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
        )
      } else if (sortType === 'active') {
        sortedQuestions = sortedQuestions.sort(
          (a, b) => b.answers.length - a.answers.length
        )
      } else if (sortType === 'unanswered') {
        sortedQuestions = sortedQuestions.filter(q => q.answers.length === 0)
      }

      setQuestions(sortedQuestions)
    } catch (error) {
      console.error('Error fetching questions', error)
    }
  }

  const handleNewestClick = async () => {
    setFilter('newest')
    await fetchAndSetQuestionsButton('newest')
  }

  const handleActiveClick = async () => {
    setFilter('active')
    await fetchAndSetQuestionsButton('active')
  }

  const handleUnansweredClick = async () => {
    setFilter('unanswered')
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

  const renderQuestions = () => {
    const filteredQuestions = questions.filter(q =>
      doesQuestionMatchSearchQuery(q, props.searchQuery)
    )
    console.log(filteredQuestions.length)
    getValue(filteredQuestions.length)
    const questionComponents = filteredQuestions.map(q => (
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

  /**
   * Returns true if a question fulfills certain values
   * @returns
   */
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
    const lowerCaseSearchString = searchString.toLowerCase()
    return (
      lowerCaseTitle.includes(lowerCaseSearchString) ||
      lowerCaseText.includes(lowerCaseSearchString)
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

  const extractAndRemoveTags = input => {
    const regex = /\[([^\]]+)\]/g
    const matches = input.match(regex)
    if (!matches) {
      const tags = []
      const text = input
      return { tags, text }
    }
    const tags = matches.map(match => match.slice(1, -1))
    const text = input.replace(regex, '')
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
          {temp2}
          {}
          {}
        </div>
      </div>
    )
  }
}

export default QuestionView
