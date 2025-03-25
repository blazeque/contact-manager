import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useContacts } from "../../hooks/useContacts";
import { useForm, Controller } from "react-hook-form";

const Header: React.FC = () => {
  const { logout, users, authUserId, deleteAccount } = useAuth();
  const contactsStore = useContacts();
  const navigate = useNavigate();
  const { control, handleSubmit, reset, setError } = useForm<{
    password: string;
  }>();

  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  const handleDeleteAccount = (data: { password: string }) => {
    try {
      deleteAccount(data.password, () => contactsStore);
      handleCloseModal();
    } catch (error: any) {
      setError("password", { type: "manual", message: error?.message });
    }
  };

  const userEmail = users?.find((user) => user.userId === authUserId)?.email;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 2, md: 3 },
        py: 2,
        backgroundColor: "#2f3036",
      }}
    >
      <img src="/images/logo-white.png" alt="Logo" height={30} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          color="white"
          variant="body2"
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {userEmail}
        </Typography>

        <Button
          variant="contained"
          color="warning"
          onClick={handleLogout}
          sx={{ height: "fit-content" }}
        >
          Sair
        </Button>

        <Button
          variant="contained"
          color="error"
          sx={{ height: "fit-content" }}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Deletar conta
        </Button>
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="button">
            Para deletar sua conta, informe sua senha de acesso.
          </Typography>
          <form onSubmit={handleSubmit(handleDeleteAccount)}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Senha"
                  type="password"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ marginTop: 2 }}
            >
              Deletar conta
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Header;
