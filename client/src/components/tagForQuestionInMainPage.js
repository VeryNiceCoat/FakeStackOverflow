import React from 'react'

const TagForQuestionInMainPage = ({ tag, onhandleTagOnMainPageClicked }) => {
  const handleTagClick = event => {
    event.preventDefault()
    onhandleTagOnMainPageClicked('[' + tag.name + ']')
  }

  return (
    <button className='tag-type' onClick={handleTagClick}>
      {tag.name}
    </button>
  )
}

export default TagForQuestionInMainPage
