import React, { useState } from 'react'
import UserProfile from './userProfile'
import Axios from 'axios'

function Header (props) {
  // const [object, setObject] = useState(props.object)
  // const [model, setModel] = useState(props.model)
  // const [query, setQuery] = useState(props.query)
  // const [email, setEmail] = useState(props.email)

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      const queryText = event.target.value
      props.onSearch(queryText)
    }
  }

  const handleLogoutClick = event => {}

  const handleDeleteAccountClick = async () => {
    try {
      const response = await Axios.get(
        'http://localhost:8000/users/accountType',
        {
          withCredentials: true
        }
      )
      if (response.data === 1) {
        throw new Error("You're a guest, you can't delete yourself")
      } else if (response.data === 2) {
        throw new Error("The Admin can't delete themselves")
      }
    } catch (error) {
      window.alert(error.message)
      return
    }
    const userConfirmed = window.confirm('Delete account? Irreversible.')
    if (userConfirmed) {
      // User confirmed deletion
      // Add your logic here for what happens when the user confirms deletion

      console.log('Account deletion confirmed')
    } else {
      // User cancelled deletion
      console.log('Account deletion cancelled')
    }
  }

  return (
    <div id='header'>
      <div>Username: {props.name}</div>
      <div>
        <button>Logout</button>
        <button>Login</button>
        <button onClick={handleDeleteAccountClick}>Delete Account</button>
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
