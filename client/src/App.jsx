import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";

export default function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      const res = await fetch("http://localhost:3001/api/plans");
      const data = await res.json();
      setPlans(data);
    }

    fetchPlans();
  }, []);

  async function handleSelectPlan(planId) {
    const res = await fetch("http://localhost:3001/api/users/me/plan", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setError("");
    } else {
      setError(data.error || "Could not update plan");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const endpoint =
      mode === "login"
        ? "http://localhost:3001/api/users/login"
        : "http://localhost:3001/api/users/register";

    const body =
      mode === "login"
        ? { username, password }
        : { username, email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setError("");
    } else {
      setError(data.error || "Something went wrong");
    }
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <div>
      <h1>Community Perk Pass</h1>

      {token ? (
        <div>
          <p>You are logged in as {user?.username}.</p>
          <p>Current plan: {user?.plan_id ?? "None selected"}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}

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
        </>
      )}

      <h2>Plans</h2>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.monthly_price}/month</p>
          <p>{plan.description}</p>
          {token && (
            <button onClick={() => handleSelectPlan(plan.id)}>
              Select Plan
            </button>
          )}
        </div>
      ))}
    </div>
  );
}