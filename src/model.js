// import moment from "https://cdn.skypack.dev/moment-timezone";

import { FORMAT, ASPECTS, perfectionDegrees, zodiac } from "./config.js";
import { fetchCityCoordinates, fetchTimezoneData, findSign, findPlanetHouses, asiaTimeZone, requestForRetro } from "./helpers.js";
import 'core-js'
import 'regenerator-runtime'

export let state = {
  // User:
  username: null,
  age: null,
  birthdate: null,
  birthtime: null,
  birthplace: null,
  formatedDate: null,

  // Settings:
  houseSystem: null,
  unknownTime: [],
  // Current
  actData: [],

  // Charts
  natalData: null,
  transitData: null,
  progressionData: null,
  draconicData: null,
  perfectionData: null,
  perfectionHouse: null,

  // Retrogrades
  natalRetro: [],
  transitRetro: [],
  progressionRetro: [],
};

export const getCurrentDateTime = function () {
  if (state.actData.length > 0) return [...state.actData];
  const now = new Date();
  const formatNumber = (num) => String(num).padStart(2, "0");
  const date = `${formatNumber(now.getDate())}.${formatNumber(now.getMonth() + 1)}.${now.getFullYear()}`;
  const time = `${formatNumber(now.getHours())}:${formatNumber(now.getMinutes())}`;
  const city = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop();
  state.actData = [date, time, city, state.houseSystem];
  return [date, time, city, state.houseSystem];
};

export const calcProgressionDate = async function () {
  try {
    const birthDateObj = new Date(state.birthdate);
    const now = new Date();
    let years = now.getFullYear() - birthDateObj.getFullYear();
    const hasBirthdayPassed =
      now.getMonth() > birthDateObj.getMonth() || (now.getMonth() === birthDateObj.getMonth() && now.getDate() >= birthDateObj.getDate());
    if (!hasBirthdayPassed) years--;
    // Progression: Date and Age
    const progressionDate = new Date(birthDateObj);
    progressionDate.setDate(progressionDate.getDate() + years);
    state.age = years;
    const formattedProgressionDate = progressionDate.toLocaleDateString("de-DE");
    const [day, month, year] = formattedProgressionDate.split(".").map(Number);

    // Retro for progression
    const [hour, minute] = state.birthtime.split(":").map(Number);
    const geoData = await fetchCityCoordinates(state.birthplace);
    if (geoData.length === 0) {
      throw new Error("City not found");
    }
    const lat = geoData[0].lat;
    const lon = geoData[0].lon;
    const requestBody = {
      year: +year,
      month: +month,
      date: +day,
      hours: +hour,
      minutes: +minute,
      seconds: 0,
      latitude: +lat,
      longitude: +lon,
      timezone: 5.5,
      settings: {
        observation_point: "topocentric" /* geocentric or topocentric */,
        ayanamsha: "tropical" /*  tropical or sayana or lahiri  */,
        language: "en" /* en , te , es , fr , pt , ru , de ,  ja */,
      },
    };
    const data = await requestForRetro(requestBody);
    //  if (!data.ok) {
    //   throw new Error(`Error: ${data.statusText}`);
    //  }
    // console.log(data);
    state.progressionRetro = Object.entries(data.output)
      .filter(([planet, details]) => details.isRetro === "true" && planet !== "Ketu" && planet !== "Rahu")
      .map(([planet]) => planet);
    state.progressionData = await convertToJSTWithAPI(state.birthplace, `${formattedProgressionDate} ${state.birthtime}`, state.houseSystem);
    if (!state.progressionData) throw new Error("Progression could not be calculated");

    return state.progressionData;
  } catch (error) {
    throw error;
  }
};

// draconicchart calc
export const calcCuspsDraconic = (data) => {
  const planets = { ...data.planets };
  const cusps = [...data.cusps];
  const nNode = planets.NNode[0];
  // Calc difference between NNode and 0 degree
  const nodeToZero = (360 - nNode) % 360;
  // Update planet position by adding the difference to degrees
  Object.keys(planets).forEach((planet) => {
    if (planet !== "NNode") {
      planets[planet] = planets[planet].map((degree) => (degree + nodeToZero) % 360);
    }
  });
  // Update cusps
  const updatedCusps = cusps.map((cusp) => (cusp + nodeToZero) % 360);
  // set NNode to 0 degree
  planets.NNode = [0];
  return {
    planets,
    cusps: updatedCusps,
  };
};

export const perfectionChart = function () {
  state.perfectionData = {
    planets: {},
    cusps: state.natalData.cusps.map((_, i) => Math.floor(state.natalData.cusps[0] / 30) * 30 + i * 30),
  };
  const index = +state.age % 12;
  state.perfectionHouse = index + 1;
  return perfectionDegrees[index];
};

// customAspects
export const calculateAspects = (positionData) => {
  const excludedPairs = new Set(["MC-IC", "MC-As", "MC-Ds", "IC-As", "IC-Ds", "As-Ds", "NNode-SNode"]);
  const planetEntries = Object.entries(positionData.planets);
  return planetEntries.flatMap(([planet1, pos1], i) =>
    planetEntries
      .slice(i + 1)
      .filter(([planet2]) => !excludedPairs.has(`${planet1}-${planet2}`) && !excludedPairs.has(`${planet2}-${planet1}`))
      .flatMap(([planet2, pos2]) => {
        let angle = Math.abs(pos1[0] - pos2[0]);
        angle = angle > 180 ? 360 - angle : angle;
        return ASPECTS.filter(({ angle: aspAngle, orb }) => Math.abs(angle - aspAngle) <= orb).map(({ name, angle: aspAngle }) => ({
          aspect: { name, degree: angle.toFixed(2) },
          point: { name: planet1, position: pos1[0] },
          toPoint: { name: planet2, position: pos2[0] },
          precision: Math.abs(angle - aspAngle) <= 1 ? 0.5 : 0.0,
        }));
      })
  );
};

export const calculateAspectsBetweenCharts = (natalData, transitData) => {
  const natalPlanets = Object.entries(natalData.planets);
  const transitPlanets = Object.entries(transitData.planets);

  return natalPlanets.flatMap(([planet1, pos1]) =>
    transitPlanets.flatMap(([planet2, pos2]) => {
      let angle = Math.abs(pos1[0] - pos2[0]);
      angle = angle > 180 ? 360 - angle : angle;

      return ASPECTS.filter(({ angle: aspAngle, orb }) => Math.abs(angle - aspAngle) <= orb).map(({ name, angle: aspAngle }) => ({
        aspect: { name, degree: angle.toFixed(2) },
        point: { name: planet1, position: pos1[0] },
        toPoint: { name: planet2, position: pos2[0] },
        precision: Math.abs(angle - aspAngle) <= 1 ? 0.5 : 0.0,
      }));
    })
  );
};

export const generateListData = function (data) {
  const houseAssignments = findPlanetHouses(data.cusps, data.planets);
  const getArr = Object.keys(data.planets).map((p) => {
    const houseNumber = houseAssignments[p][0];
    const symbol = zodiac[findSign(data.planets[p])] || findSign(data.planets[p]);
    return [p, symbol, houseNumber]; // in View [0] = planet, [1] = symbol, [2] = houseNumber
  });
  const getArrCusps = data.cusps.map((c) => findSign(c));
  const getArrAsp = calculateAspects(data).map((a) => `${a.point.name} ${a.aspect.name} ${a.toPoint.name}`);
  return [getArr, getArrCusps, getArrAsp];
};

export const generateComparisonTable = function (natalData, transitData, unknownTime) {
  const { planets: planetsNatal, cusps: cuspsNatal } = natalData;
  const { planets: planetsTransit, cusps: cuspsTransit } = transitData;
  const getHouse = (cusps, planetDegrees) => findPlanetHouses(cusps, { temp: [planetDegrees] }).temp[0] || "";
  const getSign = (degree) => findSign(degree) || "";
  return Object.entries(planetsNatal)
    .filter(([planet]) => planetsTransit[planet] !== undefined) // filter undefined values
    .map(([planet, degrees]) => ({
      Planet: planet,
      Natal: getSign(degrees[0]),
      NH: unknownTime[0] ? "" : `${planet === "Mc" ? 10 : planet === "As" ? 1 : getHouse(cuspsNatal, degrees[0])}`,
      TH: unknownTime[1] ? "" : getHouse(cuspsTransit, degrees[0]),
      Transit: getSign(planetsTransit[planet][0]),
      TH2: unknownTime[1] ? "" : `${planet === "Mc" ? 10 : planet === "As" ? 1 : getHouse(cuspsTransit, planetsTransit[planet][0])}`,
      NH2: unknownTime[0] ? "" : getHouse(cuspsNatal, planetsTransit[planet][0]),
    }));
};
import moment from 'moment-timezone'
export const convertToJSTWithAPI = async function (cityName, dateString, hSyst, uT = false) {
  try { let planetPosition = new Array();
     let cuspLongitudes = new Array();
    const geoData = await fetchCityCoordinates(cityName);
    if (geoData.length === 0) {
      throw new Error("City not found");
    }
    const countryName = geoData[0].display_name
      .split(",")
      .map((part) => part.trim())
      .pop();
    const lat = geoData[0].lat;
    const lon = geoData[0].lon;
    // get time zone info of city
    const timezoneData = await fetchTimezoneData(lat, lon);
    const zoneID = timezoneData.timezoneId; // e.g. "Europe/Berlin"
    const zoneTime = moment.tz(dateString, FORMAT, zoneID);
    // Japanese standart time (JST)
    const jstTime = asiaTimeZone(zoneTime);
    const localTime = zoneTime.format("YYYY-MM-DD HH:mm z").trim().split(" ").pop(); // next to time
    const utcTime = zoneTime.utc().format("DD.MM.YYYY HH:mm [UTC]"); // small under time
    const year = jstTime.year();
    const month = jstTime.month() + 1;
    const day = jstTime.date();
    const hour = jstTime.hour();
    const minute = jstTime.minute();
    // data for Chart
     planetPosition = calPlanetPosition2(+year, +month, +day, +hour, +minute, +lon, +lat);
    cuspLongitudes = calHouseCusp2(
      +year,
      +month,
      +day,
      +hour,
      +minute,
      +lon,
      +lat,
      hSyst // Placidius, for Koch 2
    ).filter((value) => value !== null && value !== undefined && value !== "");
    // retrodata
    const requestBody = {
      year: +year,
      month: +month,
      date: +day,
      hours: +hour,
      minutes: +minute,
      seconds: 0,
      latitude: +lat,
      longitude: +lon,
      timezone: 5.5,
      settings: {
        observation_point: "topocentric" /* geocentric or topocentric */,
        ayanamsha: "tropical" /*  tropical or sayana or lahiri  */,
        language: "en" /* en , te , es , fr , pt , ru , de ,  ja */,
      },
    };
    const data = await requestForRetro(requestBody);
    // if (!data) {
    //   console.log("retro not found");
    // }
    // console.log(data);
    const retroData = Object.entries(data.output)
      .filter(([planet, details]) => details.isRetro === "true" && planet !== "Ketu" && planet !== "Rahu")
      .map(([planet]) => planet);
    // console.log(retroData); // -> retro Planets
    /////////////////////////////////////////////////////////////////
    let positionData;
    if (uT === true) {
      positionData = {
        planets: {
          Sun: [Math.round(planetPosition[1])],
          Moon: [Math.round(planetPosition[2])],
          Mercury: [Math.round(planetPosition[3])],
          Venus: [Math.round(planetPosition[4])],
          Mars: [Math.round(planetPosition[5])],
          Jupiter: [Math.round(planetPosition[6])],
          Saturn: [Math.round(planetPosition[7])],
          Uranus: [Math.round(planetPosition[8])],
          Neptune: [Math.round(planetPosition[9])],
          Pluto: [Math.round(planetPosition[10])],
          NNode: [Math.round(planetPosition[11])],
          SNode: [Math.round(planetPosition[11] - 180)],
          Lilith: [Math.round(planetPosition[12])],
          // As: [planetPosition[13]],
          // Mc: [planetPosition[14]],
        },
        cusps: cuspLongitudes,
      };
    } else {
      positionData = {
        planets: {
          Sun: [Math.round(planetPosition[1])],
          Moon: [Math.round(planetPosition[2])],
          Mercury: [Math.round(planetPosition[3])],
          Venus: [Math.round(planetPosition[4])],
          Mars: [Math.round(planetPosition[5])],
          Jupiter: [Math.round(planetPosition[6])],
          Saturn: [Math.round(planetPosition[7])],
          Uranus: [Math.round(planetPosition[8])],
          Neptune: [Math.round(planetPosition[9])],
          Pluto: [Math.round(planetPosition[10])],
          NNode: [Math.round(planetPosition[11])],
          SNode: [Math.round(planetPosition[11] - 180)],
          Lilith: [Math.round(planetPosition[12])],
          As: [Math.round(planetPosition[13])],
          Mc: [Math.round(planetPosition[14])],
        },
        cusps: cuspLongitudes,
      };
    }
    return { positionData, countryName, localTime, utcTime, retroData };
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
