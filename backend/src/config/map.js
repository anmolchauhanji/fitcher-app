import axios from "axios";

export const reverseGeocode = async (
  latitude,
  longitude
) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;

  const { data } = await axios.get(url, {
    params: {
      latlng: `${latitude},${longitude}`,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  if (
    data.status !== "OK" ||
    !data.results.length
  ) {
    throw new Error(
      "Unable to fetch address."
    );
  }

  return data.results[0];
};