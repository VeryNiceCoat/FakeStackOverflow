// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import Login from './components/login.js'
import { useState } from 'react';

function App() {
  // const [showWelcomePage, setShowWelcomePage] = useState(true);
  // const [showLoginForm, setShowLoginForm] = useState(false);
  // const [showRegisterForm, setShowRegisterForm] = useState(false);
  // const [showRejectedMessage, setShowRejectedMessage] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  // const [identifier, setIdentifier] = useState(undefined);

  return (
    <section className="fakeso">
      {/* {showWelcomePage && (
        <Login
          showWelcomePage={showWelcomePage}
          setShowWelcomePage={setShowWelcomePage}
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
          showRegisterForm={showRegisterForm}
          setShowRegisterForm={setShowRegisterForm}
          showRejectedMessage={showRejectedMessage}
          setShowRejectedMessage={setShowRejectedMessage}
          showHomePage={showHomePage}
          setShowHomePage={setShowHomePage}
        />
      )} */}
      {showHomePage && <FakeStackOverflow />}
    </section>
  );
}

export default App;
