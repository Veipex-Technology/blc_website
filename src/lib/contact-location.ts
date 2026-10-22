const smouhaReference = {
  latitude: 31.2103802,
  longitude: 29.9667227,
};

function getCoordinate(value: string | undefined, fallback: number) {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : fallback;
}

const configuredLatitude = process.env.CONTACT_LOCATION_LATITUDE;
const configuredLongitude = process.env.CONTACT_LOCATION_LONGITUDE;

/**
 * The fallback is an OpenStreetMap Smouha City reference, not a verified
 * Al Shaker Building pin. Set both environment variables after confirmation.
 */
export const contactLocation = {
  address: "Smouha, Street 2, Midan 386, Al Shaker Building, Alexandria, Egypt",
  latitude: getCoordinate(configuredLatitude, smouhaReference.latitude),
  longitude: getCoordinate(configuredLongitude, smouhaReference.longitude),
  coordinatesConfirmed: Boolean(configuredLatitude && configuredLongitude),
};
