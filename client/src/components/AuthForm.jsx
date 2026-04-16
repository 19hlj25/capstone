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
}) {
  return (
    <div>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <button type="button" onClick={() => setMode("login")}>
        Login
      </button>
      <button type="button" onClick={() => setMode("register")}>
        Register
      </button>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            required
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        {mode === "register" && (
          <label>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        )}

        <label>
          Password
          <input
            required
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}