import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { UserRegisterDto, UserRegisterFormData } from "../types";
import { register } from "../api";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AuthContext } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";

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
    <Box sx={{mb:5}}>
      {user && <LogoutModal open />}
      <form onSubmit={ handleSubmit }>
        <h2>Register</h2>
        {error && (
          <div>
            {error}
          </div>
        )}
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
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Registering user..." : "Register"}
        </Button>
        <br />
      </form>
      <p>
        Already registered? Proceed to 
        <Button
        variant="text"
        type="button"
        onClick={() => navigate("/login")}>
          Log In
        </Button>
      </p>
    </Box>
  )

}