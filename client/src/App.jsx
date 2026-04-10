import { useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import AuthForm from "./components/AuthForm";

// Main application component for Community Perk Pass.
// Manages authentication state and controls the authentication flow.
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sends login or registration data to the backend API.
  // Saves the returned token and user data when authentication succeeds.
  async function handleSubmit(event) {
    event.preventDefault();

    const API = import.meta.env.VITE_API;
    const endpoint =
      mode === "login" ? `${API}/api/users/login` : `${API}/api/users/register`;

    const body =
      mode === "login"
        ? { username, password }
        : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Something went wrong");
        return;
      }

      setToken(result.token);
      setUser(result.user);
      localStorage.setItem("token", result.token);

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("auth error:", error);
    }
  }

  // Clears the user's session from state and localStorage.
  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <div>
      <Hero />

      <AuthForm
        mode={mode}
        setMode={setMode}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        token={token}
      />

      {token && (
        <div>
          <p>Welcome, {user?.username || "user"}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}