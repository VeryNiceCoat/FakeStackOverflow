import React, { useState } from 'react'
// import Axios from 'axios'

const CommentForm = ({ onSubmit, onCancel }) => {
  const [commentText, setCommentText] = useState('')

  const handleSubmit = e => {
    e.preventDefault();
    // Check if the commentText is not empty and does not exceed 140 characters
    if (commentText && commentText.length <= 140) {
      onSubmit(commentText);
      setCommentText('');
    } else {
      // Handle the error, maybe display a message to the user
      alert("Comment cannot exceed 140 characters.");
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
