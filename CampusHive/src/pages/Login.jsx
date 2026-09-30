import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, saveSession } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // login request
  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          saveSession(data);
          window.location.href = "/resources";
        } else {
          setMessage(data.message);
        }
      })
      .catch(() => setMessage("Cannot connect to the server. Is the backend running?"));
  };

  return (
    <div className="auth-page">
      <form className="box auth-box" onSubmit={handleSubmit}>
        <h1>CampusHive</h1>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="btn auth-button">Login</button>
        {message && <p className="message">{message}</p>}

        <p className="auth-links">
          Don't have an account? <Link to="/register">Register</Link></p>
        <p className="auth-links">
          <Link to="/">Back to Home</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
