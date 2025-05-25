import { FormEvent, useContext, useState } from "react";
import { login } from "../api";
import { useNavigate  } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import LoggedOutAlert from "./dialog/LoggedOutAlert";
import Link from "@mui/material/Link";

export default function Login() {
  const navigate = useNavigate();

  const { fromLogout } = useContext(AuthContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { refreshUser } = useContext(AuthContext);
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      navigate("/", { replace:true });
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
      refreshUser();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {
          fromLogout
            ? <LoggedOutAlert />
            : null
        }
        <TextField
          type="text"
          label="username"
          sx={{ mb: 2 }}
          className="inputWithMb"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <br />
        <TextField
          type="password"
          label="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br />
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error === "Unauthorized"
            ? "The username and/or password did not match a registered user."
            : error
          }
        </Alert>
      )}
      <p>Are you a new user? Proceed to
        <Link
        onClick={() => navigate("/register")}
        sx={{
          cursor: "pointer",
          display: "inline-block",
          px: 1,
          py: 0.5
        }}
        >
          Registration Page
        </Link>

      </p>
        
    </div>
  );

};