import { FormEvent, useContext, useState } from "react";
import { login } from "../api";
import { useNavigate  } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import LoggedOutAlert from "./dialog/LoggedOutAlert";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import AuthAppBar from "./AuthAppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

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

  const centerColFlexBox = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }

  return (
    <>
    <AuthAppBar/>
    <Box
      sx={{
        ...centerColFlexBox,
        width: "100vw"
      }}
    >
      <Toolbar
        variant="dense"
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          ...centerColFlexBox,
        }}
      >
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
        <TextField
          type="password"
          label="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In" }
          <LoginIcon
            sx={{
              ml: 1
            }}
          />
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error === "Unauthorized"
            ? "The username and/or password did not match a registered user."
            : error
          }
        </Alert>
      )}
      <Divider />
      <p>Are you a new user?</p>
      <Link
        onClick={() => navigate("/register")}
        sx={{
          cursor: "pointer",
        }}
      >
        Registration Page
      </Link>
    </Box>
    </>
  );

};