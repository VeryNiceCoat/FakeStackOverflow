import React, { useState } from 'react'

function Header (props) {
  const [object, setObject] = useState(props.object)
  const [model, setModel] = useState(props.model)
  const [query, setQuery] = useState(props.query)
  // const [email, setEmail] = useState(props.email)

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      const queryText = event.target.value
      props.onSearch(queryText)
    }
  }

  const handleLogoutClick = event => {
    
  }

  return (
    <div id='header'>
      <div>Username: {props.name}</div>
      <div>
        <button>Logout</button>
        <button>Login</button>
        <button>Delete Account</button>
      </div>
      <div className='logo'>FAKE STACK OVERFLOW</div>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search...'
          className='search-input'
          id='search-input-'
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

export default Header
