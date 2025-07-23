import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { whoAmI, logout } from "../api";
import { User } from "../library/types";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  handleLogout: async () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {enqueueSnackbar} = useSnackbar();

  const refreshUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const u = await whoAmI();
      setUser(u);
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : "User refresh failed."
      setError(msg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
      try {
      await logout();
      enqueueSnackbar("You have logged out.")
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err)
    } finally {
      await refreshUser();
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value=
      {{
        user,
        loading,
        error,
        refreshUser,
        handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};