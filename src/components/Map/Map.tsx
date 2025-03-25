import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface MapProps {
  latlng?: { lat: number; lng: number };
}

const CustomMap: React.FC<MapProps> = ({ latlng }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <GoogleMap
      center={latlng}
      zoom={15}
      mapContainerStyle={{ width: "100%", height: "100%" }}
    >
      {latlng && <Marker position={latlng} />}
    </GoogleMap>
  );
};

export default CustomMap;
