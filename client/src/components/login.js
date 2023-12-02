import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Login (props) {
  const {
    showWelcomePage,
    setShowWelcomePage,
    showLoginForm,
    setShowLoginForm,
    showRegisterForm,
    setShowRegisterForm,
    showRejectedMessage,
    setShowRejectedMessage,
    showHomePage,
    setShowHomePage
  } = props

  const handleLoginClick = async () => {
    setShowRegisterForm(false)
    setShowRejectedMessage(false)
    setShowLoginForm(true)
  }

  const handleRegisterClick = () => {
    setShowLoginForm(false)
    setShowRejectedMessage(false)
    setShowRegisterForm(true)
  }

  const handleLoginSubmit = async event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await Axios.get('http://localhost:8000/users/login', {
        withCredentials: true,
        params: {
          email: email,
          password: password
        }
      })
      if (response.status !== 200) {
        window.alert('Login Invalid')
        return
      }
      console.log(response)
      props.setEmail(email)
      console.log(response.data);
      props.setName(response.data)
      setShowRegisterForm(false)
      setShowLoginForm(false)
      setShowRejectedMessage(false)
      setShowWelcomePage(false)
      setShowHomePage(true)
      return
    } catch (error) {
      window.alert('Submission Error')
    }
  }

  const handleGuestClick = async () => {
    setShowLoginForm(false)
    setShowRegisterForm(false)
    setShowRejectedMessage(false)
  }

  return (
    <div className='loginContainer'>
      <h3>Welcome to FakeStackOverflow</h3>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleRegisterClick}>Register</button>
      <button onClick={handleGuestClick}>Guest</button>
      {showLoginForm && (
        <form onSubmit={handleLoginSubmit}>
          <input type='text' name='email' placeholder='Email' />
          <input type='text' name='password' placeholder='Password' />
          <button type='submit'>Submit</button>
        </form>
      )}
      {showRegisterForm && (
        <form>
          <input type='text' name='name' placeholder='Username' />
          <input type='text' name='email' placeholder='Email' />
          <input type='text' name='password' placeholder='Password' />
          <button type='submit'>Submit</button>
        </form>
      )}
    </div>
  )
}

export default Login
