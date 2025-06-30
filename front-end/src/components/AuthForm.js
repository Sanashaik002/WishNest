import { useState } from 'react';
import './AuthForm.css';
import { useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

const BASE_URL = "http://localhost:5000";

const AuthForm = ({ setIsLoggedIn, setUser ,isDark, toggleTheme}) => {

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isForgotMode) {
        await axios.post(`${BASE_URL}/api/auth/reset-password`, formData);
        alert('Password reset successful. Please login again.');
        setIsForgotMode(false); // Go back to login form
        setFormData({ email: '', password: '' });
        return;
      }


    // ✅ Login or Signup logic
    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    const res = await axios.post(`${BASE_URL}${endpoint}`, formData);
    const token = res.data.token;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsLoggedIn(true);
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.msg;
    if (msg === "User does not exist") setError("User doesn't exist");
    else if (msg === "Invalid credentials") setError("Invalid password");
    else setError("Something went wrong. Try again.");
  }
};


  const handleGoogleLogin = async (response) => {
  try {
    const decoded = jwtDecode(response.credential);
    const res = await axios.post(`${BASE_URL}/api/auth/google-login`, {
      email: decoded.email,
      name: decoded.name
    });

    const token = res.data.token;
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
    setIsLoggedIn(true);
  } catch (error) {
    const msg = error?.response?.data?.message;
    if (msg === 'User does not exist') {
      alert("User doesn't exist. Please sign up first.");
    } else {
      alert('Google login failed');
    }
  }
};

  return (
    <>
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
    <h1 className="welcome-heading">✨ Welcome to WishNest ✨</h1>
    <div className="auth-container">
      
      <h2>
        {isForgotMode ? 'Reset Password' : isSignup ? 'Sign Up' : 'Login'}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="eye-icon"
            onClick={() => setShowPassword(prev => !prev)}
          />
        </div>

        <button type="submit">
          {isForgotMode ? 'Reset Password' : isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {!isForgotMode && (
        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => {
            setIsSignup(!isSignup);
            setError('');
          }}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      )}

      {!isSignup && !isForgotMode && (
        <p style={{ textAlign: 'center' }}>
          <button onClick={() => {
            setIsForgotMode(true);
            setError('');
          }}>
            Forgot Password?
          </button>
        </p>
      )}

      {isForgotMode && (
        <p style={{ textAlign: 'center' }}>
          <button onClick={() => {
            setIsForgotMode(false);
            setError('');
          }}>
            Back to Login
          </button>
        </p>
      )}

      {!isSignup && !isForgotMode && (
        <>
          <p className="or-divider">or</p>
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert('Google login failed')}
              useOneTap
            />
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default AuthForm;
