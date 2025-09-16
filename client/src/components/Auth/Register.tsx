import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { UserRegisterDto, UserRegisterFormData } from "../../library/types";
import { register } from "../../api";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { AuthContext } from "../../context/AuthContext";
import LogoutModal from "../dialog/LogoutModal";
import Link from "@mui/material/Link";
import AuthAppBar from "../Layout/AuthAppBar";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";

export default function Register() {
  const { user } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserRegisterFormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload: UserRegisterDto = formData;

    try {
      const response = await register(payload);
      if (response instanceof Response) { 
        navigate("/login", { replace: true })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthAppBar />
    <Box
      sx={{
        ...CENTER_COL_FLEX_BOX,
        alignItems: "center",
        mb:5
      }}>
      <Toolbar
        variant="dense"
      />
      {user && <LogoutModal open />}
      <Box
        component="form"
        onSubmit={ handleSubmit }
        sx={{
          ...CENTER_COL_FLEX_BOX,
          alignItems: "center"
        }}
      >
        <h2>Register</h2>
        {error && (
          <div>
            {error}
          </div>
        )}
        <p>Enter your contact info:</p>
        <TextField
          label="email"
          sx={{ mb: 2 }}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <TextField
          label="first name"
          sx={{ mb: 2 }}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <br />
        <TextField
          label="last name"
          sx={{ mb: 2 }}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <br />
        <p>Create your credentials:</p>
        <TextField
          label="username"
          sx ={{ mb: 2 }}
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <TextField
          label="password"
          sx={{ mb: 2 }}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            m: 2,
            display: "flex",
            alignItems: "center"
          }}
        >
          {loading ? "Registering user..." : "Register"}
          <HowToRegIcon
            sx={{
              ml: 1,
              verticalAlign: "middle",
            }}
          />
        </Button>
        <br />
      </Box>
      <Box
        sx={{
          ...CENTER_COL_FLEX_BOX,
          alignItems: "center"
        }}
      >
        <Divider />
        <p>Already registered?</p>
        <Link
        onClick={() => navigate("/login")}
        sx={{
          cursor: "pointer",
        }}
        >
          Login Page
        </Link>
      </Box>
    </Box>
    </>
  )

}