import React from 'react'
import Axios from 'axios'

const QuestionFormContainer = ({ onSubmit }) => {
  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const temp = await Axios.get('http://localhost:8000/users/accountType', {
        withCredentials: true
      })
      if (temp.data === 1) {
        window.alert("Can't submit a question as a guest")
        return
      }
    } catch (error) {
      window.alert('Server Error, restart')
      return
    }
    const title = event.target.questionTitle.value
    const text = event.target.questionBody.value
    const summary = event.target.questionSummary.value
    const rawTagNames = event.target.formTags.value.split(' ')
    const tagNames = rawTagNames.map(name => name.toLowerCase())
    if (!containsInvalidLink(text)) {
      alert(
        'Please ensure that all hyperlinks are in the correct format and contain valid URLs.'
      )
      return
    }
    /**
     * This section is supposed to handle when a user can or cannot make new tags.
     * The first if statemet is a copy of the old code, the else statement will be something new.
     * Right now each conditional block handles making the question and submitting it, later it can be dealt with
     */
    let response1
    try {
      response1 = await Axios.get(
        'http://localhost:8000/users/canMakeNewTags',
        { withCredentials: true }
      )
    } catch (error) {
      console.error('response1 error', error)
    }
    if (response1.data === true) {
      const tagsCollectionResponse = await Axios.get(
        'http://localhost:8000/tags'
      )
      const tagsCollection = await tagsCollectionResponse.data
      const updatedTagsCollection = [...tagsCollection]
      const tagsIds = []
      for (const tagName of tagNames) {
        let existingTag = updatedTagsCollection.find(
          tag => tag.name === tagName
        )
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
        summary: summary,
        text: text,
        tags: tagsIds
      }
      try {
        await Axios.post('http://localhost:8000/questions', newQuestionData, {
          withCredentials: true
        })
        onSubmit()
      } catch (error) {
        console.log(error)
      }
    } else {
      const tagsCollectionResponse = await Axios.get(
        'http://localhost:8000/tags'
      )
      const tagsCollection = await tagsCollectionResponse.data
      const updatedTagsCollection = [...tagsCollection]
      const tagsCollectionNames = updatedTagsCollection.map(tag => tag.name)
      const tagsIds = []
      const value = isArraySubset(tagNames, tagsCollectionNames)
      if (value === false) {
        window.alert(
          'Reputation is less then 50, and you tried to make a new tag, denied, or you made 0 tags'
        )
        return
      } else {
        for (const tagName of tagNames) {
          let existingTag = updatedTagsCollection.find(
            tag => tag.name === tagName
          )
          tagsIds.push(existingTag._id)
        }
        const newQuestionData = {
          title: title,
          summary: summary,
          text: text,
          tags: tagsIds
        }
        try {
          await Axios.post('http://localhost:8000/questions', newQuestionData, {
            withCredentials: true
          })
          onSubmit()
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  function isArraySubset (array1, array2) {
    // Check if array1 is empty
    if (array1.length === 0) {
      return false
    }

    // Convert both arrays to lowercase
    const lowerCaseArray1 = array1.map(element => element.toLowerCase())
    const lowerCaseArray2 = array2.map(element => element.toLowerCase())

    // Check if every element in array1 is included in array2
    return lowerCaseArray1.every(element => lowerCaseArray2.includes(element))
  }

  // Example usage
  const array1 = [] //

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
          pattern='.{0,140}'
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
        {}

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
