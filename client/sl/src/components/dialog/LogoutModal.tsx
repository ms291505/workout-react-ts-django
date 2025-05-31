import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

interface LogoutModalProps {
  open: boolean;
}

export default function LogoutModal({ open }: LogoutModalProps) {
  const { handleLogout } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/");
  }

  return (
    <Dialog
      open={open}
    >
      <DialogTitle>
        {"You are already logged in."}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You cannot register a new user until you log out.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleLogout} variant="contained">
          Log Out
        </Button>
      </DialogActions>
    </Dialog>

  )
}