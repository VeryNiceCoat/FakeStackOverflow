import React, { useEffect, useState } from 'react'
import Axios from 'axios'

const CommentForm = ({ onSubmit, onCancel }) => {
  const [commentText, setCommentText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (commentText) {
      onSubmit(commentText)
      setCommentText('')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Comment Text, 140 characters max</label>
        <input 
          type='text'
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={140}
        />
        <button type="submit">Submit Comment</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default CommentForm
