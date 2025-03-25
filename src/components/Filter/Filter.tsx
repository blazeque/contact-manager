import { TextField, Box, IconButton } from "@mui/material";
import { SwapVert } from "@mui/icons-material";

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  orderDirection: "asc" | "desc";
  setOrderDirection: (direction: "asc" | "desc") => void;
}

const Filter: React.FC<FilterProps> = ({
  value,
  onChange,
  orderDirection,
  setOrderDirection,
}) => {
  return (
    <Box
      sx={{ display: "flex", marginBottom: 2, alignItems: "center", gap: 2 }}
    >
      <TextField
        label="Filtrar por nome ou CPF"
        variant="outlined"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <IconButton
        onClick={() =>
          setOrderDirection(orderDirection === "asc" ? "desc" : "asc")
        }
      >
        <SwapVert />
      </IconButton>
    </Box>
  );
};

export default Filter;
