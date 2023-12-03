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
      props.setEmail(email)
      props.setName(response.data)
      setShowRegisterForm(false)
      setShowLoginForm(false)
      setShowRejectedMessage(false)
      setShowWelcomePage(false)
      setShowHomePage(true)
      return
    } catch (error) {
      window.alert('Login Credentials Not Correct')
    }
  }

  const handleGuestClick = async () => {
    try {
      const response = await Axios.get('http://localhost:8000/users/login', {
        withCredentials: true,
        params: {
          email: 'guest@guest.com',
          password: 'guest'
        }
      })
      if (response.status !== 200) {
        window.alert('Login Invalid')
        return
      }
      props.setEmail('guest@guest.com')
      props.setName('guest')
      setShowRegisterForm(false)
      setShowLoginForm(false)
      setShowRejectedMessage(false)
      setShowWelcomePage(false)
      setShowHomePage(true)
      return
    } catch (error) {
      window.alert('Guest Button Error')
    }
  }

  const handleRegisterSubmit = async event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await Axios.post(
        'http://localhost:8000/users/register',
        {
          name: name,
          email: email,
          password: password
        },
        {
          withCredentials: true
        }
      )

      if (response.status !== 200) {
        window.alert('Registration Invalid')
        return
      }

      props.setEmail(email)
      props.setName(name)
      setShowRegisterForm(false)
      setShowLoginForm(false)
      setShowRejectedMessage(false)
      setShowWelcomePage(false)
      setShowHomePage(true)
      return
    } catch (error) {
      if (error.response.status === 400) {
        window.alert('Email Already Exists')
      } else {
        window.alert('Server Error')
      }
    }
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
        <form onSubmit={handleRegisterSubmit}>
          <input
            type='text'
            id='username'
            name='name'
            placeholder='Username'
            required
          />
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Email'
            required
          />
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Password'
            required
            pattern={`^(?!.*${
              document.getElementById('username')?.value
            })(?!.*${
              document.getElementById('email')?.value.split('@')[0]
            }).*$`}
            title='Password must not contain username or email id.'
          />
          <button type='submit'>Submit</button>
        </form>
      )}
    </div>
  )
}

export default Login
