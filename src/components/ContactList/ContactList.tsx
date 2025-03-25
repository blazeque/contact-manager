import { useState } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import { Filter } from "../Filter";
import { ContactForm } from "../ContactForm";
import { useContact } from "../../hooks/useContacts";

interface ContactListProps {
  onContactClick: (latlng: { lat: number; lng: number }) => void;
}

const ContactList: React.FC<ContactListProps> = ({ onContactClick }) => {
  const { contacts, deleteContact } = useContact();

  const [modalOpen, setModalOpen] = useState<{
    open: boolean;
    contactId?: string;
  }>({ open: false, contactId: undefined });
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.cpf.includes(search)
    )
    .sort((a, b) =>
      orderDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", md: "30%" },
        minWidth: "340px",
        height: { xs: "45%", md: "100%" },
        padding: 3,
      }}
    >
      <Box
        sx={{
          marginBottom: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Contatos
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setModalOpen({ open: true })}
        >
          Adicionar contato
        </Button>
      </Box>

      <Filter
        value={search}
        onChange={setSearch}
        orderDirection={orderDirection}
        setOrderDirection={setOrderDirection}
      />

      {filteredContacts.length === 0 && (
        <Typography variant="body2" sx={{ marginTop: 2, textAlign: "center" }}>
          Nenhum contato encontrado
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          height: "100%",
          padding: 0.5,
        }}
      >
        {filteredContacts?.map((contact) => (
          <Box
            key={contact.id}
            sx={{
              padding: 2,
              borderRadius: 2,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: 1,
              border: "1px solid #f0f0f0",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() =>
              onContactClick({ lat: contact.lat, lng: contact.lng })
            }
          >
            <Box>
              <Typography variant="h6">{contact.name}</Typography>
              <Typography variant="body2">{contact.cpf}</Typography>
              <Typography variant="body2">{contact.phone}</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                sx={{ height: "fit-content" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "Tem certeza que deseja excluir este contato?"
                    )
                  ) {
                    deleteContact(contact.id);
                  }
                }}
              >
                Excluir
              </Button>

              <Button
                variant="outlined"
                color="info"
                sx={{ height: "fit-content" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen({ open: true, contactId: contact.id });
                }}
              >
                Editar
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      <Modal
        open={modalOpen.open}
        onClose={() => setModalOpen({ open: false, contactId: undefined })}
      >
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
            p: 4,
          }}
        >
          <ContactForm
            onSelect={onContactClick}
            onClose={() => setModalOpen({ open: false, contactId: undefined })}
            contactId={modalOpen.contactId}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ContactList;
