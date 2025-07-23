import { zodiac, getLink } from "./config.js";
import { timeApiKey } from "./configKey.js";
// Helper functions to send a POST request
// import "core-js";
// import "regenerator-runtime";

const fetchData = async (url, errorMessage) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Something went wrong, ${response.status}: ${errorMessage}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error: ", error.message);
    throw error;
  }
};

export const fetchCityCoordinates = async (cityName) => {
  const url = `${getLink.geoUrl}${cityName}`;
  return await fetchData(url, "City coordinates not found");
};

export const fetchTimezoneData = async (lat, lon) => {
  const url = `${getLink.timezoneUrl}key=${timeApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;

  // `${getLink.timezoneUrl}lat=${lat}&lng=${lon}&d=${d}`;
  return await fetchData(url, "Timezone data not found");
};
export const asiaTimeZone = (zT) => zT.clone().tz("Asia/Tokyo");

// Find sign of planet by its degree
export const findSign = (degree) => {
  const normalizedDegree = ((+degree % 360) + 360) % 360; // degree should be between 0-359
  const index = Math.floor(normalizedDegree / 30);
  return Object.keys(zodiac)[index];
};

export const findPlanetHouses = function (cusps, planets) {
  const houseAssignments = {};
  for (const [planet, positions] of Object.entries(planets)) {
    houseAssignments[planet] = positions.map((position) => {
      // Sonstige Planeten: Berechnung basierend auf den Haus-Cusps
      for (let i = 0; i < cusps.length; i++) {
        let nextIndex = (i + 1) % cusps.length;
        let cuspStart = cusps[i];
        let cuspEnd = cusps[nextIndex];

        // Berechnung der Häuser anhand der Cusps
        if (cuspStart < cuspEnd) {
          if (position >= cuspStart && position < cuspEnd) {
            return i + 1; // Hausnummer zurückgeben
          }
        } else {
          // Wenn der Cusp von 359° auf 0° übergeht
          if (position >= cuspStart || position < cuspEnd) {
            return i + 1;
          }
        }
      }
      return null; // Falls keine Übereinstimmung gefunden wurde
    });
  }
  return houseAssignments;
};

export const mergeRetroList = (firstArray, secondArray) => {
  const modifiedSecondArray = secondArray.map((planet) => `${planet}ᵗ`);
  return [...firstArray, ...modifiedSecondArray];
};
