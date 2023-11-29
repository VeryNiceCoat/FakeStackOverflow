import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Login (props) {
    const {
        showWelcomePage,
        setShowWelcomePage,
        showLoginForm,
        setShowLoginForm,
        setShowRegisterForm,
        showRejectedMessage,
        setShowRejectedMessage,
        showHomePage,
        setShowHomePage
    } = props;

    const handleLoginClick = () => {
        setShowRegisterForm(false);
        setShowRejectedMessage(false);
        setShowLoginForm(true);
    }

    const handleRegisterClick = () => {
        setShowLoginForm(false);
        setShowRejectedMessage(false);
        setShowRegisterForm(true);
    }

    const handleLoginSubmit = event => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('name');
        const password = formData.get('password');
        console.log('Username:', username, 'Password:', password);


    };

    return(
        <div className='loginContainer'>
            <h3>Welcome to FakeStackOverflow</h3>
            <button onClick={handleLoginClick}>Login</button>
            <button onClick={handleRegisterClick}>Register</button>
            <button>Guest</button>
            {showLoginForm && (
                <form onSubmit={handleLoginSubmit}>
                    <input type='text' name='name' placeholder='Username'/>
                    <input type='text' name='password' placeholder='Password'/>
                    <button type='submit'>Submit</button>
                </form>
            )}
            {setShowRegisterForm && (
                <form>
                    <input type='text' name='name' placeholder='Username'/>
                    <input type='text' name='email' placeholder='Email'/>
                    <input type='text' name='password' placeholder='Password'/>
                    <button type='submit'>Submit</button>
                </form>
            )}
        </div>
    );
}

export default Login;