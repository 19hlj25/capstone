import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`${API}/plans`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not load plans");
        }

        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Could not load plans.");
      }
    }

    fetchPlans();
  }, []);

  useEffect(() => {
    async function fetchMe() {
      if (!token) return;

      try {
        const res = await fetch(`${API}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setError(data.error || "Could not load user.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Could not load user.");
      }
    }

    fetchMe();
  }, [token]);

  async function handleSelectPlan(planId) {
    try {
      const res = await fetch(`${API}/users/me/plan`, {
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
    } catch (error) {
      console.error("Error updating plan:", error);
      setError("Could not update plan");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const endpoint =
      mode === "login" ? `${API}/users/login` : `${API}/users/register`;

    const body =
      mode === "login"
        ? { username, password }
        : { username, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setError("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during auth:", error);
      setError("Could not connect to server.");
    }
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setError("");
  }

  return (
    <div>
      <h1>Community Perk Pass</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {token ? (
        <div>
          <p>You are logged in as {user?.username}.</p>
          <p>Current plan: {user?.plan_id ?? "None selected"}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
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
        />
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