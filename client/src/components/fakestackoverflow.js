import React, { useState } from 'react'
import '../stylesheets/App.css'
import Sidebar from './sidebar.js'
import Header from './header.js'
import QuestionView from './questionView.js'

export default function FakeStackOverflow (props) {
  const [selectedView, setSelectedView] = useState('Questions')
  const [showPostView, setShowPostView] = useState(false)
  const [showQForm, setShowQForm] = useState(false)
  const [showAForm, setShowAForm] = useState(false)
  const [showTagsPage, setShowTagsPage] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleQuestionsClick = () => {
    setShowPostView(false)
    setShowQForm(false)
    setShowAForm(false)
    setShowTagsPage(false)
    setSearchQuery('')
    setSelectedView('Questions')
  }
  const handleTagsPageClick = () => {
    setShowPostView(false)
    setShowQForm(false)
    setShowAForm(false)
    setShowTagsPage(true)
    setSearchQuery('')
    setSelectedView('Tags')
  }

  const handleTagonTagPageClicked = string => {
    setShowPostView(false)
    setShowQForm(false)
    setShowAForm(false)
    setShowTagsPage(false)
    setSearchQuery(string)
  }

  const handleTagOnMainPageClicked = string => {
    setSearchQuery(string)
  }

  return (
    <div className='container'>
      <div className='header'>
        <Header
          onSearch={setSearchQuery}
          email={props.email}
          setEmail={props.setEmail}
          name={props.name}
          setName={props.setName}
        />
        {}
      </div>
      <div className='content'>
        <Sidebar
          selected={selectedView}
          onSelect={setSelectedView}
          onQuestionsClick={handleQuestionsClick}
          onTagsPageClick={handleTagsPageClick}
          onhandleTagonTagPageClicked={handleTagonTagPageClicked}
        />
        <div className='question-view'>
          <QuestionView
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
            showPostView={showPostView}
            setShowPostView={setShowPostView}
            showTagsPage={showTagsPage}
            setShowTagsPage={setShowTagsPage}
            showQForm={showQForm}
            setShowQForm={setShowQForm}
            showAForm={showAForm}
            setShowAForm={setShowAForm}
            selected={selectedView}
            onhandleTagonTagPageClicked={handleTagonTagPageClicked}
            onhandleTagOnMainPageClicked={handleTagOnMainPageClicked}
          />
        </div>
      </div>
    </div>
  )
}
