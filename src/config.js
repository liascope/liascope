// config.js
// import { astrochart } from "@astrodraw/astrochart";
// import 'core-js'
// import 'regenerator-runtime'

export const getLink = {
  geoUrl: "https://nominatim.openstreetmap.org/search?format=json&q=",
  timezoneUrl: "https://api.timezonedb.com/v2.1/get-time-zone?",
  //  "http://api.geonames.org/timezoneJSON?",
};
export const timeApiKey = "1SIV2C3L0GHD";
export const FORMAT = "DD.MM.YYYY HH:mm";
export const maxRows = 15;
export const defaultTime = "12:00";
// prettier-ignore
export const symbols = [["☉", "Sun"],["☽", "Moon"],["☿", "Mercury"], ["♀", "Venus"],["♂", "Mars"], ["♃", "Jupiter"], ["♄", "Saturn"], ["♅", "Uranus"],["♆", "Neptun"],["♇", "Pluto"],["☊", "NNode"],["☋", "SNode"],["⚸", "Lilith"],["", "As"], ["", "Mc"],
];
export const aspectSymbols = { sextile: "✱", square: "☐", trine: "Δ", opposition: "☍", conjunction: "☌", quincunx: "⚻", semiSextile: "⚺" };
// prettier-ignore
export const zodiac = { Aries: "♈",Taurus: "♉",Gemini: "♊",Cancer: "♋",Leo: "♌",Virgo: "♍",Libra: "♎",Scorpio: "♏",Sagittarius: "♐",Capricorn: "♑",Aquarius: "♒",Pisces: "♓",
};
export const ASPECTS = [
  { name: "conjunction", angle: 0, orb: 7 },
  { name: "opposition", angle: 180, orb: 7 },
  { name: "trine", angle: 120, orb: 5 },
  { name: "square", angle: 90, orb: 7 },
  { name: "sextile", angle: 60, orb: 4 },
  { name: "quincunx", angle: 150, orb: 1 },
  { name: "semiSextile", angle: 30, orb: 1 },
];
export const houseSystems = {
  1: "Placidus",
  2: "Campanus",
  3: "Regiomantanus",
  4: "Koch",
  5: "Topocentric",
  6: "Axial",
  7: "Morinus",
};
export const dignity = [
  ["rs:", "Rulership"],
  ["d:", "Detriment"],
  ["e:", "Exaltation"],
  ["E:", "Exact Exaltation"],
  ["f:", "Fall"],
];
export const perfectionHouseDescriptions = {
  1: "focuses on self, personal growth, and outer appearance. This is a time for redefining your identity and projecting yourself into the world.",
  2: "centers around material resources, finances, and values. A period where you're likely to focus on building security, reviewing priorities, and improving your financial stability.",
  3: "emphasizes communication, learning, and your immediate environment. It's a great time to improve your skills, engage with your community, or explore new ideas.",
  4: "relates to home, family, and emotional foundations. A period for enhancing your living situation, resolving family matters, or reconnecting with your roots.",
  5: "highlights creativity, self-expression, and romance. You may experience a surge in your artistic endeavors, take risks in love, or embrace more fun and enjoyment.",
  6: "deals with work, health, and daily routines. This is a time to focus on improving your habits, refining your skills, and achieving a better work-life balance.",
  7: "is about partnerships, both romantic and professional. Your relationships take center stage, encouraging you to build stronger, more harmonious connections.",
  8: "concerns transformation, shared resources, and deep emotional connections. It's a time for profound personal growth, releasing the old, and discovering new ways of relating.",
  9: "focuses on philosophy, higher education, and travel. This is a period for expanding your horizons, exploring new belief systems, or embarking on a spiritual journey.",
  10: "is about career, professional goals, and public life. A time to achieve and make strides in your career, while strengthening your public role and reputation.",
  11: "centers around friendships, social networks, and long-term goals. This period highlights your role within a larger community, encouraging collaboration and the pursuit of shared ideals.",
  12: "focuses on retreat, inner reflection, and healing. A time to connect with your subconscious, process past experiences, and undergo spiritual renewal.",
};

export const perfectionSignDescriptions = {
  Aries: "brings boldness, courage, and an active approach to life. You're motivated to take the lead and face challenges head-on.",
  Taurus:
    "adds stability, persistence, and a focus on material security. It's a time for building solid foundations, finding comfort, and enjoying life's pleasures.",
  Gemini: "encourages curiosity, adaptability, and intellectual engagement. A time to communicate, learn, and explore new ideas and perspectives.",
  Cancer:
    "creates an emotionally sensitive and nurturing environment. You may also focus on caring for your loved ones, your home, and your emotional well-being.",
  Leo: "enhances creativity, self-expression, and leadership. This is a time for showcasing your talents, taking center stage, and embracing your inner confidence.",
  Virgo: "brings focus to organization, health, and improvement. You are driven to refine your skills, improve daily routines, and serve others.",
  Libra:
    "highlights balance, harmony, and relationships. A time to focus on partnerships, diplomacy, and creating a peaceful atmosphere in your life.",
  Scorpio:
    "promotes transformation, emotional depth, and powerful connections. This period encourages deep inner growth, change, and the release of old patterns.",
  Sagittarius:
    "inspires adventure, exploration, and philosophy. It's a time to expand your horizons, embrace new experiences, and deepen your understanding of the world.",
  Capricorn: "emphasizes discipline, ambition, and long-term planning. You focus on your career, structure, and achieving lasting success.",
  Aquarius:
    "fosters innovation, independence, and forward-thinking. A time to embrace originality, connect with social causes, and explore new ideas.",
  Pisces:
    "nurtures spirituality, creativity, and emotional intuition. You may connect with your dreams, embrace compassion, and explore your spiritual side.",
};

const settings = {
  POINTS_TEXT_SIZE: 12,
  MARGIN: 80,
  PADDING: 18,
  COLORS_SIGNS: Array(3).fill(["#ce8063", "#c4a484", "#afc8e7", "#4fa091"]).flat(),
  DIGNITIES_RULERSHIP: "rs",
  DIGNITIES_DETRIMENT: "d",
  DIGNITIES_EXALTATION: "e",
  DIGNITIES_EXACT_EXALTATION: "E",
  DIGNITIES_FALL: "f",
};

export const chart = new astrochart.Chart("paper--1", 800, 800, settings);
export const natalTransit = new astrochart.Chart("paper--2", 800, 800, settings);
export const horary = new astrochart.Chart("paper--3", 800, 800, settings);
export const progression = new astrochart.Chart("paper--4", 800, 800);
export const draconic = new astrochart.Chart("paper--5", 800, 800, settings);
export const perfection = new astrochart.Chart("paper--6", 800, 800, settings);
export const perfectionDegrees = [165, 135, 105, 75, 45, 15, 345, 315, 285, 255, 225, 195];
