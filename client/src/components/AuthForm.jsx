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
  authMessage,
  isSubmitting,
  handleSubmit,
  token,
}) {
  const isRegisterMode = mode === "register";
  return (
    <div>
      <h2>{isRegisterMode ? "Register" : "Login"}</h2>

      <button
        type="button"
        onClick={() => setMode("login")}
        aria-pressed={!isRegisterMode}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => setMode("register")}
        aria-pressed={isRegisterMode}
      >
        Register
      </button>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        {isRegisterMode && (
          <label>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        )}

        <label>
          Password
          <input
            type="password"
            value={password}
            autoComplete={isRegisterMode ? "new-password" : "current-password"}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Submitting..."
            : isRegisterMode
              ? "Register"
              : "Login"}
        </button>
      </form>

      {/* WHY (Documentation + Functionality): A clear status message makes auth outcomes understandable and easier to debug for beginners. */}
      {authMessage ? <p>{authMessage}</p> : null}
      <p>{token ? "Logged in" : "Not logged in"}</p>
    </div>
  );
}
