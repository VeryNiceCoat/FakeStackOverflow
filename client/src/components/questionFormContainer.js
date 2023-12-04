import React from 'react'
import Axios from 'axios'

const QuestionFormContainer = ({ onSubmit }) => {
  const handleSubmit = async event => {
    event.preventDefault()
    const title = event.target.questionTitle.value
    const text = event.target.questionBody.value
    // const username = event.target.formUsername.value
    const rawTagNames = event.target.formTags.value.split(' ')
    const tagNames = rawTagNames.map(name => name.toLowerCase())
    if (!containsInvalidLink(text)) {
      alert(
        'Please ensure that all hyperlinks are in the correct format and contain valid URLs.'
      )
      return
    }

    const tagsCollectionResponse = await Axios.get('http://localhost:8000/tags')
    const tagsCollection = await tagsCollectionResponse.data
    const updatedTagsCollection = [...tagsCollection]
    const tagsIds = []
    for (const tagName of tagNames) {
      let existingTag = updatedTagsCollection.find(tag => tag.name === tagName)
      if (existingTag) {
        tagsIds.push(existingTag._id)
      } else {
        const newTagData = { name: tagName }
        const newTagResponse = await Axios.post(
          'http://localhost:8000/tags',
          newTagData
        )
        const newTag = newTagResponse.data
        updatedTagsCollection.push(newTag)
        tagsIds.push(newTag._id)
      }
    }
    if (tagsIds.length === 0) {
      console.error('No tags were created or fetched.')
      return
    }
    const newQuestionData = {
      title: title,
      text: text,
      tags: tagsIds,
      // asked_by: username
    }

    await Axios.post('http://localhost:8000/questions', newQuestionData).then(
      function (res) {
        if (res.status === 201) {
          
        } else {
          console.error('error code: ', res.status)
        }
        onSubmit()
      }
    )
  }

  return (
    <div id='questionFormContainer'>
      <form id='questionForm' onSubmit={handleSubmit}>
        <label htmlFor='questionTitle'>Question Title:*</label>
        <p>Limit titles to 100 characters or less.</p>
        <input
          type='text'
          id='questionTitle'
          name='questionTitle'
          pattern='.{0,100}'
          required
          title='Max 100 characters'
        />
        <label htmlFor='questionSummary'>Question Summary:*</label>
        <p>Limit Summaries to 140 characters or less</p>
        <input 
          type='text'
          id='questionSummary'
          name='questionSummary'
          pattern='{0,140}'
          required
          title='Max 140 Characters'
        />
        <label htmlFor='questionBody'>Question:*</label>
        <textarea
          id='questionBody'
          name='questionBody'
          rows='4'
          required
        ></textarea>
        <label htmlFor='formTags'>Tags:*</label>
        <p>
          Add keywords separated by whitespace. 5 tags max, no more than 10
          characters per tag
        </p>
        <input
          type='text'
          id='formTags'
          name='formTags'
          pattern='^(?:\b\w{1,10}\b\s*){1,5}$'
          required
          title='Up to 5 tags, each no longer than 10 characters, separated by whitespace.'
        />
        {/* <label htmlFor='formUsername'>Username:*</label>
        <input type='text' id='formUsername' name='formUsername' required /> */}

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default QuestionFormContainer

function containsInvalidLink (text) {
  const regex = /\[([^\]]*?)\]\((.*?)\)/g
  let match
  let isValid = true

  while ((match = regex.exec(text)) !== null) {
    if (
      !match[2].trim() ||
      !(match[2].startsWith('http://') || match[2].startsWith('https://'))
    ) {
      isValid = false
      break
    }
  }

  if (isValid && !regex.exec(text) && /\(\s*\)/.test(text)) {
    isValid = false
  }

  return isValid
}
