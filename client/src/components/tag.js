import React from 'react'

/**
 * Tag for the tag page
 */
const Tag = ({ tag, questions, onhandleTagonTagPageClicked }) => {
  /**
   * Makes the Global Search only have a single tag element of tag title
   */
  const handleTagClick = () => {
    onhandleTagonTagPageClicked('[' + tag.name + ']')
  }

  const getQuestionsWithTag = () => {
    let count = 0
    questions.forEach(q => {
      if (q.tags.includes(tag._id)) {
        count++
      }
    })
    return count
  }

  return (
    <button className='tagCard' onClick={handleTagClick}>
      <div className='tagName'>{tag.name}</div>
      <div className='total-questions'>{getQuestionsWithTag()} questions</div>
    </button>
  )
}

export default Tag
