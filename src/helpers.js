import { zodiac, getLink, userName, apiKey, timeApiKey } from "./config.js";
// Helper functions to send a POST request
import 'core-js'
import 'regenerator-runtime'

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

  // `${getLink.timezoneUrl}lat=${lat}&lng=${lon}&username=${userName}`;
  return await fetchData(url, "Timezone data not found");
};
export const asiaTimeZone = (zT) => zT.clone().tz("Asia/Tokyo");

export const requestForRetro = async (requestBody, retries = 3, delay = 1000) => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(getLink.retroUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      });
      if (response.status === 429 && attempt < retries) {
        console.warn(`API Limit erreicht, neuer Versuch in ${delay / 2000} Sekunden...`);
        await wait(delay);
        delay *= 2; // Exponential Backoff
        continue;
      }
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Fehler (Versuch ${attempt}/${retries}):`, error);
      if (attempt === retries) throw error;
    }
  }
};

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
