import { Autocomplete, TextField } from "@mui/material";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Controller, Control } from "react-hook-form";
import { getMapLocation, getPostalCode } from "../../utils/map";
import { FormData } from "../ContactForm/ContactForm";

interface AddressAutocompleteProps {
  onSelect: (latLng: { lat: number; lng: number }) => void;
  control: Control<FormData>;
  setPostalCode?: (postalCode: string) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  control,
  setPostalCode,
}) => {
  const {
    ready,
    setValue,
    suggestions: { data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    if (!address) return;

    setValue(address, false);
    clearSuggestions();

    const postalCode = await getPostalCode(address);
    setPostalCode?.(postalCode ?? "");
    
    const location = await getMapLocation(address);

    onSelect({ lat: location.lat, lng: location.lng });
  };

  return (
    <Controller
      name="address"
      control={control}
      defaultValue=""
      rules={{ required: "Endereço é obrigatório" }}
      render={({ field, fieldState }) => (
        <Autocomplete
          getOptionLabel={(option) => option.description || ""}
          filterOptions={(x) => x}
          options={data}
          onChange={(_, newValue) => {
            const address = newValue?.description ?? "";
            handleSelect(address);
            field.onChange(address);
          }}
          inputValue={field.value}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => {
                field.onChange(e.target.value);
                setValue(e.target.value);
              }}
              disabled={!ready}
              label="Endereço"
              fullWidth
              margin="dense"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}
    />
  );
};

export default AddressAutocomplete;
