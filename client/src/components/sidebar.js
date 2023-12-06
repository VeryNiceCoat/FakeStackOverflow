import React, { useState } from 'react'
import Axios from 'axios'

const Sidebar = props => {
  const [selected, setSelected] = useState('Questions')

  // Handlers for different link clicks
  const handleQuestionsClick = () => {
    handleLinkClick('Questions')
    if (props.onQuestionsClick) {
      setSelected('Questions')
      props.onQuestionsClick()
    }
  }

  const handleTagsClick = () => {
    handleLinkClick('Tags')
    if (props.onTagsPageClick) {
      setSelected('Tags')
      props.onTagsPageClick()
    }
  }

  const handleProfileClick = async () => {
    try {
      const response = await Axios.get(
        'http://localhost:8000/users/accountType',
        {
          withCredentials: true
        }
      )
      if (response.data === 1) {
        throw new Error("You're a guest, you don't have a profile")
      }
    } catch (error) {
      window.alert(error.message)
      return
    }
    handleLinkClick('Profile')
    if (props.onProfilePageClick) {
      setSelected('Profile')
      props.onProfilePageClick()
    }
  }

  // Common function to handle link click
  const handleLinkClick = linkName => {
    props.onSelect(linkName)
  }

  // Styling function
  const linkStyle = linkName => {
    return {
      backgroundColor: selected === linkName ? 'gray' : 'paleturquoise'
    }
  }

  return (
    <div className='sidebar'>
      <ul>
        <li>
          <button
            id='Questions'
            style={linkStyle('Questions')}
            onClick={handleQuestionsClick}
          >
            Questions
          </button>
        </li>
        <li>
          <button id='Tags' style={linkStyle('Tags')} onClick={handleTagsClick}>
            Tags
          </button>
        </li>
        <li>
          <button
            id='Profile'
            style={linkStyle('Profile')}
            onClick={handleProfileClick}
          >
            Your Profile
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
