import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Login() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = userState(false);
    const [showRejectedMessage, setShowRejectedMessage] = useState(false);

    const handleLoginClick = () => {
        console.log('login click detected');
        setShowLoginForm(true);
    }

    return(
        <div className='loginContainer'>
            <h3>Welcome to FakeStackOverflow</h3>
            <button onClick={handleLoginClick}>Login</button>
            <button>Register</button>
            <button>Guest</button>
            {showLoginForm && (
                <form>
                    <input type='text' placeholder='Username'/>
                    <input type='text' placeholder='Password'/>
                    <button type='submit'>Submit</button>
                </form>
            )}
        </div>
    );
}

export default Login;