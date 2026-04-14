import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";

const API_BASE_URL = "http://localhost:3001/api";
const MIN_PASSWORD_LENGTH = 8;

function normalizeAuthInput({ username = "", email = "", password = "" }) {
  return {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [plans, setPlans] = useState([]);
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`${API_BASE_URL}/plans`);
        const data = await res.json();
        setPlans(Array.isArray(data) ? data : []);
      } catch {
        setPlans([]);
      }
    }

    fetchPlans();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthMessage("");

    const normalized = normalizeAuthInput({ username, email, password });
    if (!normalized.username || !normalized.password) {
      setAuthMessage("Username and password are required.");
      return;
    }

    // WHY (Functionality): Matching backend register rules on the client gives
    // faster feedback before the network request is sent.
    if (mode === "register") {
      if (!normalized.email) {
        setAuthMessage("Email is required for registration.");
        return;
      }

      if (normalized.password.length < MIN_PASSWORD_LENGTH) {
        setAuthMessage(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        );
        return;
      }
    }

    const endpoint =
      mode === "login"
        ? `${API_BASE_URL}/users/login`
        : `${API_BASE_URL}/users/register`;

    const body =
      mode === "login"
        ? { username: normalized.username, password: normalized.password }
        : {
            username: normalized.username,
            email: normalized.email,
            password: normalized.password,
          };

    setIsSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthMessage(data?.error || "Authentication failed.");
        return;
      }

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAuthMessage("Success! You are authenticated.");
        setPassword("");
      } else {
        setAuthMessage("Authentication failed.");
      }
    } catch {
      setAuthMessage("Unable to reach server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setAuthMessage("");
    setPassword("");
  }

  return (
    <div>
      <h1>Community Perk Pass</h1>

      <AuthForm
        mode={mode}
        setMode={handleModeChange}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        authMessage={authMessage}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        token={token}
      />

      <h2>Plans</h2>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.monthly_price}/month</p>
          <p>{plan.description}</p>
        </div>
      ))}
    </div>
  );
}
