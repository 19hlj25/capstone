import { useEffect, useState } from "react";
import heroImg from "./assets/hero.png";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const API = import.meta.env.VITE_API;

    async function testConnection() {
      try {
        const res = await fetch(API);
        const text = await res.text();
        console.log("backend response:", text);
      } catch (error) {
        console.error("fetch error:", error);
      }
    }

    testConnection();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const API = import.meta.env.VITE_API;
    const endpoint = 
      mode === "login" ? `${API}/api/users/login` : `${API}/api/users/register`;

      const body = 
        mode === "login"
        ? { username, password }
        : {username, email, password};
      
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
          alert(result.error || "Something went wrong");
          return;
        }

        setToken
      }}

  return (
    <div>
      <h1>Community Perk Pass</h1>
      <img src={heroImg} alt="Community Perk Pass" width="170" />
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <button onClick={() => setMode("login")}>Login</button>
      <button onClick={() => setMode("register")}>Register</button>

      <form>
        <label>
          Username
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        {mode === "register" && (
          <label>
            Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            </label>
        )}

        <label>
          Password
          <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>

      </form>

      
      <p>{token ? "Logged in" : "Not logged in"}</p>
    </div>
  );
}