import { Box } from "@mui/material";
import { AuthForm } from "../components";

const Register: React.FC = () => {
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
      <AuthForm type="register" />
    </Box>
  );
};

export default Register;
