import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";

// Determines API base URL. Uses deployed backend if available, otherwise falls back to local server.
const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Main application component that handles authentication, user state, and plan selection.
export default function App() {
  // Tracks whether user is in login or register mode.
  const [mode, setMode] = useState("login");

  // Stores the currently logged-in user, pulled from localStorage if available.
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Controlled form inputs for authentication.
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Stores JWT token used for authenticated requests.
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Stores available subscription plans from the backend.
  const [plans, setPlans] = useState([]);

  // Stores available local businesses from the backend.
  const [businesses, setBusinesses] = useState([]);

  // Stores error messages for display in the UI.
  const [error, setError] = useState("");

  // Fetches all available plans and businesses when the app loads.
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

    async function fetchBusinesses() {
      try {
        const res = await fetch(`${API}/businesses`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not load businesses");
        }

        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setError("Could not load businesses.");
      }
    }

    fetchPlans();
    fetchBusinesses();
  }, []);

  // Fetches the currently logged-in user's latest data using the stored token.
  // This keeps the user state in sync after refresh.
  useEffect(() => {
    async function fetchMe() {
      if (!token) return;

      try {
        const res = await fetch(`${API}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Error fetching user:", text);
          setError("Could not load user.");
          return;
        }

        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Could not load user.");
      }
    }

    fetchMe();
  }, [token]);

  // Sends a request to update the logged-in user's selected subscription plan.
  // On success, it updates both state and localStorage with the new user data.
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

  // Handles login and registration form submission.
  // Stores the returned token and user in both React state and localStorage.
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

  // Logs the user out by clearing token and user data from state and localStorage.
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

      {/* Displays any error messages. */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Shows user info if logged in, otherwise renders the authentication form. */}
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

      {/* Displays all plans and highlights the user's currently selected one. */}
      {plans.map((plan) => {
        const isCurrent = Number(user?.plan_id) === Number(plan.id);

        return (
          <div
            key={plan.id}
            style={{
              border: isCurrent ? "2px solid green" : "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{plan.name}</h3>
            <p>${plan.monthly_price}/month</p>
            <p>${plan.coupon_value} in coupons</p>
            <p>{plan.description}</p>

            {/* Shows a label for the current plan or a button to select a different one. */}
            {token &&
              (isCurrent ? (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  Current Plan
                </p>
              ) : (
                <button onClick={() => handleSelectPlan(plan.id)}>
                  Select Plan
                </button>
              ))}
          </div>
        );
      })}

      <h2>Businesses</h2>

      {/* Displays all local businesses available in the app. */}
      {businesses.map((business) => (
        <div
          key={business.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{business.name}</h3>
          <p>Category: {business.category}</p>
          <p>{business.description}</p>
          <p>Location: {business.location}</p>
        </div>
      ))}
    </div>
  );
}