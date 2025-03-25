export const fetchCoordinates = async (address: string) => {
  const baseURL = process.env.REACT_APP_GOOGLE_MAPS_BASE_URL;
  const apiKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  try {
    const response = await fetch(
      `${baseURL}/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKEY}`
    );
    const data = await response.json();

    if (data.status !== "OK") throw new Error("Endereço não encontrado");

    return data.results[0].geometry.location;
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
};
