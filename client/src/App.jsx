import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";

export default function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function fetchPlans() {
      const res = await fetch("http://localhost:3001/api/plans");
      const data = await res.json();
      setPlans(data);
    }

    fetchPlans();
  }, []);

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
    }
  }

  return (
    <div>
      <h1>Community Perk Pass</h1>

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