// Renders the authentication form for login and registration.
// Displays different fields depending on the selected auth mode.
export default function AuthForm({
  mode,
  setMode,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  token,
}) {
  return (
    <div>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <button onClick={() => setMode("login")}>Login</button>
      <button onClick={() => setMode("register")}>Register</button>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        {mode === "register" && (
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        )}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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