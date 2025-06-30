import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Wishlist from './components/WishList';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    // ✅ Persist theme preference
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  useEffect(() => {
    document.body.className = isDark ? 'dark-mode' : 'light-mode';

    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const { email } = JSON.parse(atob(token.split('.')[1])); // or use jwtDecode
        setUser({ email });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token");
        setUser(null);
        setIsLoggedIn(false);
      }
    }
  }, [isDark, user]);

  return (
    <Router>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Wishlist
                user={user}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
                isDark={isDark}
                toggleTheme={toggleTheme}
              />
            ) : (
              <AuthForm
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
                isDark={isDark}
                toggleTheme={toggleTheme}
              />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
