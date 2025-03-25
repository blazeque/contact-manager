import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { fetchCoordinates } from "../../services/googleMaps";
import { AddressAutocomplete } from "../AddressAutocomplete";
import { formatCEP, formatCPF, formatPhone } from "../../utils/formatters";
import { v4 as uuidv4 } from "uuid";
import { validateCPF } from "../../utils/validates";
import { fetchAddress } from "../../services/viacep";
import { useContact } from "../../hooks/useContacts";
import { useAuth } from "../../hooks/useAuth";
import { getMapLocation } from "../../utils/map";

interface ContactFormProps {
  onSelect: (latLng: { lat: number; lng: number }) => void;
  onClose: () => void;
  contactId?: string;
}

export interface FormData {
  name: string;
  cpf: string;
  phone: string;
  address: string;
  cep: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSelect,
  onClose,
  contactId,
}) => {
  const { addContact, contacts, updateContact } = useContact();
  const { authUserId } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "all",
    defaultValues: contacts.find((contact) => contact.id === contactId),
  });

  const handleCepChange = async (cepValue: string) => {
    const formattedCep = formatCEP(cepValue);
    setValue("cep", formattedCep);

    if (formattedCep.replace(/\D/g, "").length === 8) {
      const addressData = await fetchAddress(formattedCep);
      
      if (addressData) {
        const formattedAddress = `${addressData.street} - ${addressData.neighborhood}, ${addressData.city} - ${addressData.state}, Brasil`;
        const location = await getMapLocation(formattedAddress);

        onSelect({ lat: location.lat, lng: location.lng });
        setValue("address", formattedAddress);

        return;
      }

      return setError("cep", {
        type: "manual",
        message: "CEP inválido.",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    const fullAddress = `${data.address}, ${data.cep}`;
    const coordinates = await fetchCoordinates(fullAddress);

    try {
      if (contactId) {
        updateContact(contactId, {
          name: data.name,
          cpf: data.cpf,
          phone: data.phone,
          address: data.address,
          lat: coordinates?.lat ?? 0,
          lng: coordinates?.lng ?? 0,
          cep: data.cep,
        });

        reset();
        onClose();
        return;
      }

      addContact({
        id: uuidv4(),
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        address: data.address,
        lat: coordinates?.lat ?? 0,
        lng: coordinates?.lng ?? 0,
        createdBy: authUserId!,
        cep: data.cep,
      });

      reset();
      onClose();
    } catch (error: any) {
      setError("cpf", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        textTransform="uppercase"
        sx={{ marginBottom: 2 }}
      >
        {contactId ? "Editar contato" : "Adicionar contato"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Nome é obrigatório." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome"
              variant="outlined"
              fullWidth
              margin="dense"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{ required: "Telefone é obrigatório." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Telefone"
              variant="outlined"
              fullWidth
              margin="dense"
              onChange={(e) => field.onChange(formatPhone(e.target.value))}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="cpf"
          control={control}
          defaultValue=""
          rules={{
            required: "CPF é obrigatório.",
            validate: (value) => (!validateCPF(value) ? "CPF inválido." : true),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="CPF"
              variant="outlined"
              fullWidth
              margin="dense"
              onChange={(e) => field.onChange(formatCPF(e.target.value))}
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
            />
          )}
        />

        <Controller
          name="cep"
          control={control}
          defaultValue=""
          rules={{ required: "CEP é obrigatório." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="CEP"
              variant="outlined"
              fullWidth
              margin="dense"
              onChange={(e) => handleCepChange(e.target.value)}
              error={!!errors.cep}
              helperText={errors.cep?.message}
            />
          )}
        />

        <AddressAutocomplete
          onSelect={onSelect}
          control={control}
          setPostalCode={(postalCode: string) => setValue("cep", postalCode)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {contactId ? "Editar Contato" : "Adicionar Contato"}
        </Button>
      </form>
    </Box>
  );
};

export default ContactForm;
