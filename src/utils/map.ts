import { getGeocode, getLatLng } from "use-places-autocomplete";

export const getMapLocation = async (address: string) => {
  const results = await getGeocode({ address });
  const { lat, lng } = getLatLng(results[0]);

  return { lat, lng };
};

export const getPostalCode = async (address: string) => {
  const results = await getGeocode({ address });
  const postalCode = results[0].address_components.find((component: any) =>
    component.types.includes("postal_code")
  )?.long_name;

  return postalCode;
};
