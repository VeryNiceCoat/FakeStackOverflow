// import Model from '../models/model.js';
// import { Question, Tid, Answer } from '../models/temp.js';
// import React, { useEffect, useState, useCallback}from'react';
import React, {useState} from 'react';
// import React, { useState, useCallback } from 'react';
import '../stylesheets/App.css';
// import Post from './post.js';
// import AnswerTab from './answer.js';
// import TagPage from './tag-page.js';
import Sidebar from './sidebar.js';
import Header from './header.js';
import QuestionView from './questionView.js';
// import Query from './objectForSearching.js';

// import Axios from 'axios'

// const GlobalModel = new Model();
// const QQuery = new Query();

export default function FakeStackOverflow() {
  const [selectedView, setSelectedView] = useState('Questions');
  const [showPostView, setShowPostView] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [showAForm, setShowAForm] = useState(false);
  const [showTagsPage, setShowTagsPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // useEffect(() => {
  //   if (window.location.pathname === '/') {
  //       window.location.pathname = '/questions';
  //   }
  // }, []);
  //set conditions to false to default to renderQuestion()
  const handleQuestionsClick = () => {
    setShowPostView(false);
    setShowQForm(false);
    setShowAForm(false);
    setShowTagsPage(false);
    setSearchQuery('');
    setSelectedView('Questions');
    // window.location.pathname = '/questions';
  };
  //set other conditions to false, setShowTagsPage(true) to render Tag page
  const handleTagsPageClick= () => {
    setShowPostView(false);
    setShowQForm(false);
    setShowAForm(false);
    setShowTagsPage(true);
    setSearchQuery('');
    setSelectedView('Tags');
    // window.location.pathname = '/tags'
  }

  /**
   * This is for when a tag on the tag pages is clicked
   */
  const handleTagonTagPageClicked = (string) => {
    setShowPostView(false);
    setShowQForm(false);
    setShowAForm(false);
    setShowTagsPage(false);
    setSearchQuery(string);
  }

  const handleTagOnMainPageClicked = (string) => {
    setSearchQuery(string);
  }

  return (
    <div className="container">
      <div className='header'>
        <Header onSearch={setSearchQuery} /> 
        {/* model={GlobalModel} */}
      </div>
      <div className='content'>
          <Sidebar 
              // model={GlobalModel}
              selected={selectedView} 
              onSelect={setSelectedView} 
              onQuestionsClick={handleQuestionsClick}  
              onTagsPageClick={handleTagsPageClick} 
              onhandleTagonTagPageClicked = {handleTagonTagPageClicked}
          />
              
        <div className='question-view'>
          <QuestionView 
              // model={GlobalModel} 
              // query={QQuery} 
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
              onhandleTagonTagPageClicked = {handleTagonTagPageClicked}
              onhandleTagOnMainPageClicked = {handleTagOnMainPageClicked}
          />
        </div>
      </div>
    </div>
  );
}

