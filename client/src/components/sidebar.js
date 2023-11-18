import React, { useState } from 'react'
const Sidebar = props => {
  const [selected, setSelected] = useState('Questions')
  const handleLinkClick = linkName => {
    props.onSelect(linkName)
  }

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
            onClick={e => {
              e.preventDefault()
              handleLinkClick('Questions')
              if (props.onQuestionsClick) {
                setSelected('Questions')
                props.onQuestionsClick()
              }
            }}
          >
            Questions
          </button>
        </li>
        <li>
          <button
            id='Tags'
            style={linkStyle('Tags')}
            onClick={() => {
              handleLinkClick('Tags')
              if (props.onTagsPageClick) {
                setSelected('Tags')
                props.onTagsPageClick()
              }
            }}
          >
            Tags
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
