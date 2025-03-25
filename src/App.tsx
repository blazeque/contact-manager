import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { CssBaseline } from "@mui/material";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppRoutes />
    </Router>
  );
};

export default App;
