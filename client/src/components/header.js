import React, { useState } from 'react'
import UserProfile from './userProfile'
import Axios from 'axios'

function Header (props) {
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      const queryText = event.target.value
      props.onSearch(queryText)
    }
  }

  const returnToLoginPage = async () => {
    try {
      const value = await Axios.get('http://localhost:8000/users/accountType', {
        withCredentials: true
      })
      console.log(value)
      if (value === 0 || value === 2) {
        throw new Error(
          'Use the logout button if you are not signed in as a guest'
        )
        // window.alert("Use the logout button if you are not signed in as a guest")
      }
      props.setShowHomePage(false)
      props.setShowWelcomePage(true)
    } catch (error) {
      window.alert(error.message)
    }
  }

  const handleLogoutClick = async event => {
    try {
      await Axios.get('http://localhost:8000/users/logout', {
        withCredentials: true
      })
      props.setShowHomePage(false)
      props.setShowWelcomePage(true)
      // returnToLoginPage()
    } catch (error) {
      window.alert(error.message)
    }
  }

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
      props.setShowHomePage(false)
      props.setShowWelcomePage(true)
    } else {
      // User cancelled deletion
      console.log('Account deletion cancelled')
    }
  }

  return (
    <div id='header'>
      <div>Username: {props.name}</div>
      <div>
        <button onClick={handleLogoutClick}>Logout</button>
        <button onClick={returnToLoginPage}>Login</button>
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
