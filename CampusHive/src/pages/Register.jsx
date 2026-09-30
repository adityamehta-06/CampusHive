import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, saveSession } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // register request
    fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
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
        <h2>Create your account</h2>

        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        <button type="submit" className="btn auth-button">Register</button>
        {message && <p className="message">{message}</p>}

        <p className="auth-links">
          Already have an account? <Link to="/login">Login</Link></p>
        <p className="auth-links">
          <Link to="/">Back to Home</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
