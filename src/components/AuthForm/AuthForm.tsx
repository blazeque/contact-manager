import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";

interface AuthFormProps {
  type: "login" | "register";
}

interface FormData {
  email: string;
  password: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (type === "login") {
      if (login(data.email, data.password)) {
        return navigate("/dashboard");
      }

      setError("Usuário ou senha inválidos");
    } else if (type === "register") {
      if (register(data.email, data.password)) {
        return navigate("/dashboard");
      }

      setError("Erro ao cadastrar usuário");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        borderRadius: 3,
        overflow: "hidden",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#222226",
          width: "200px",
          padding: 4,
        }}
      >
        <img
          src="/images/logo-white.png"
          alt="Logo"
          style={{ width: "100%", height: "fit-content" }}
        />
      </Box>

      <Box
        sx={{
          padding: 4,
          bgcolor: "background.paper",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" textTransform="uppercase" fontWeight={700}>
          {type === "login" ? "Login" : "Cadastro"}
        </Typography>

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email é obrigatório.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email inválido.",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              margin="dense"
              error={!!errors.email || !!error}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Senha é obrigatória." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="dense"
              error={!!errors.password || !!error}
              helperText={errors.password?.message ?? error}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {type === "login" ? "Entrar" : "Cadastrar"}
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mt: 1,
          }}
        >
          <Typography variant="caption">
            {type === "login"
              ? "Ainda não tem uma conta?"
              : "Já tem uma conta?"}
          </Typography>
          <Link
            to={type === "login" ? "/register" : "/login"}
            style={{
              textDecoration: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#1976d2",
            }}
          >
            {type === "login" ? "Cadastre-se" : "Entrar"}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
