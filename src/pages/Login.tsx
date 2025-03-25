import { AuthForm } from "../components";
import { Box } from "@mui/material";

const Login: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/images/bg-image.jpg')",
      }}
    >
      <AuthForm type="login" />
    </Box>
  );
};

export default Login;
