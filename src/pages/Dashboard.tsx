import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ContactList, Header, Map } from "../components";
import { useContact } from "../hooks/useContacts";

const Dashboard: React.FC = () => {
  const { loadContacts } = useContact();

  const [addressMarker, setAddressMarker] = useState<{
    lat: number;
    lng: number;
  }>({ lat: -23.55052, lng: -46.63331 });

  useEffect(() => {
    loadContacts();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddressMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Usuário negou a permissão de localização.");
        }
      );
    }
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <ContactList
          onContactClick={(latlng: { lat: number; lng: number }) =>
            setAddressMarker(latlng)
          }
        />
        <Map latlng={addressMarker} />
      </Box>
    </Box>
  );
};

export default Dashboard;
