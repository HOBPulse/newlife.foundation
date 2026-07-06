import type { Locale } from "@/i18n/routing";

/** Route data provided by the owner (task.md, 2026-07) — city/country pairs.
 *  Aggregated network only: no counts, no dates, no patient linkage. */

export type LocalizedName = Record<Locale, string>;

export type Hub = {
  id: string;
  name: LocalizedName;
  lat: number;
  lng: number;
  /** Label placement relative to the projected dot, in viewBox units. */
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" };
};

export type DestinationCity = {
  id: string;
  name: LocalizedName;
  lat: number;
  lng: number;
  /** Reached by air — rendered as a curved dashed arc with a plane glyph. */
  air?: boolean;
};

export type Country = {
  id: string;
  name: LocalizedName;
  cities: DestinationCity[];
  /** Nudge for the country label away from dot clusters, in viewBox units. */
  labelOffset?: [number, number];
  labelAnchor?: "start" | "middle" | "end";
};

export const HUBS: Hub[] = [
  {
    id: "kyiv",
    name: { uk: "Київ", ru: "Киев", en: "Kyiv" },
    lat: 50.45,
    lng: 30.52,
    label: { dx: 10, dy: 16, anchor: "start" },
  },
  {
    id: "dnipro",
    name: { uk: "Дніпро", ru: "Днепр", en: "Dnipro" },
    lat: 48.46,
    lng: 35.04,
    label: { dx: -10, dy: 5, anchor: "end" },
  },
  {
    id: "lviv",
    name: { uk: "Львів", ru: "Львов", en: "Lviv" },
    lat: 49.84,
    lng: 24.03,
    label: { dx: 12, dy: 8, anchor: "start" },
  },
  {
    id: "kharkiv",
    name: { uk: "Харків", ru: "Харьков", en: "Kharkiv" },
    lat: 49.99,
    lng: 36.23,
    label: { dx: 0, dy: -12, anchor: "middle" },
  },
  {
    id: "odesa",
    name: { uk: "Одеса", ru: "Одесса", en: "Odesa" },
    lat: 46.48,
    lng: 30.72,
    label: { dx: -11, dy: -8, anchor: "end" },
  },
];

export const COUNTRIES: Country[] = [
  {
    id: "italy",
    name: { uk: "Італія", ru: "Италия", en: "Italy" },
    labelOffset: [-11, 26],
    cities: [
      { id: "rome", name: { uk: "Рим", ru: "Рим", en: "Rome" }, lat: 41.9, lng: 12.5, air: true },
      { id: "milan", name: { uk: "Мілан", ru: "Милан", en: "Milan" }, lat: 45.46, lng: 9.19 },
      { id: "palermo", name: { uk: "Палермо", ru: "Палермо", en: "Palermo" }, lat: 38.12, lng: 13.36, air: true },
    ],
  },
  {
    id: "greece",
    name: { uk: "Греція", ru: "Греция", en: "Greece" },
    labelOffset: [0, 16],
    cities: [
      { id: "thessaloniki", name: { uk: "Салоніки", ru: "Салоники", en: "Thessaloniki" }, lat: 40.64, lng: 22.94 },
    ],
  },
  {
    id: "turkey",
    name: { uk: "Туреччина", ru: "Турция", en: "Turkey" },
    labelOffset: [14, 6],
    cities: [
      { id: "istanbul", name: { uk: "Стамбул", ru: "Стамбул", en: "Istanbul" }, lat: 41.01, lng: 28.98, air: true },
      { id: "alanya", name: { uk: "Аланія", ru: "Алания", en: "Alanya" }, lat: 36.54, lng: 32.0, air: true },
      { id: "bursa", name: { uk: "Бурса", ru: "Бурса", en: "Bursa" }, lat: 40.19, lng: 29.06, air: true },
      { id: "antalya", name: { uk: "Анталія", ru: "Анталия", en: "Antalya" }, lat: 36.9, lng: 30.71, air: true },
    ],
  },
  {
    id: "spain",
    name: { uk: "Іспанія", ru: "Испания", en: "Spain" },
    labelOffset: [-24, 14],
    cities: [
      { id: "barcelona", name: { uk: "Барселона", ru: "Барселона", en: "Barcelona" }, lat: 41.39, lng: 2.17, air: true },
      { id: "malaga", name: { uk: "Малага", ru: "Малага", en: "Málaga" }, lat: 36.72, lng: -4.42, air: true },
      { id: "madrid", name: { uk: "Мадрид", ru: "Мадрид", en: "Madrid" }, lat: 40.42, lng: -3.7, air: true },
    ],
  },
  {
    id: "israel",
    name: { uk: "Ізраїль", ru: "Израиль", en: "Israel" },
    labelOffset: [14, 4],
    labelAnchor: "start",
    cities: [
      { id: "tel-aviv", name: { uk: "Тель-Авів", ru: "Тель-Авив", en: "Tel Aviv" }, lat: 32.09, lng: 34.78, air: true },
    ],
  },
  {
    id: "germany",
    name: { uk: "Німеччина", ru: "Германия", en: "Germany" },
    labelOffset: [-11, 56],
    cities: [
      { id: "berlin", name: { uk: "Берлін", ru: "Берлин", en: "Berlin" }, lat: 52.52, lng: 13.41 },
      { id: "frankfurt", name: { uk: "Франкфурт-на-Майні", ru: "Франкфурт-на-Майне", en: "Frankfurt am Main" }, lat: 50.11, lng: 8.68 },
      { id: "cologne", name: { uk: "Кельн", ru: "Кёльн", en: "Cologne" }, lat: 50.94, lng: 6.96 },
      { id: "bonn", name: { uk: "Бонн", ru: "Бонн", en: "Bonn" }, lat: 50.74, lng: 7.1 },
      { id: "essen", name: { uk: "Ессен", ru: "Эссен", en: "Essen" }, lat: 51.46, lng: 7.01 },
      { id: "dusseldorf", name: { uk: "Дюссельдорф", ru: "Дюссельдорф", en: "Düsseldorf" }, lat: 51.23, lng: 6.77 },
      { id: "marburg", name: { uk: "Марбург", ru: "Марбург", en: "Marburg" }, lat: 50.81, lng: 8.77 },
      { id: "hamburg", name: { uk: "Гамбург", ru: "Гамбург", en: "Hamburg" }, lat: 53.55, lng: 9.99 },
    ],
  },
  {
    id: "poland",
    name: { uk: "Польща", ru: "Польша", en: "Poland" },
    labelOffset: [-31, -35],
    cities: [
      { id: "wroclaw", name: { uk: "Вроцлав", ru: "Вроцлав", en: "Wrocław" }, lat: 51.11, lng: 17.03 },
      { id: "warsaw", name: { uk: "Варшава", ru: "Варшава", en: "Warsaw" }, lat: 52.23, lng: 21.01 },
      { id: "lublin", name: { uk: "Люблін", ru: "Люблин", en: "Lublin" }, lat: 51.25, lng: 22.57 },
      { id: "krakow", name: { uk: "Краків", ru: "Краков", en: "Kraków" }, lat: 50.06, lng: 19.94 },
      { id: "przemysl", name: { uk: "Перемишль", ru: "Пшемысль", en: "Przemyśl" }, lat: 49.78, lng: 22.77 },
      { id: "gdansk", name: { uk: "Гданськ", ru: "Гданьск", en: "Gdańsk" }, lat: 54.35, lng: 18.65 },
      { id: "bielsko-biala", name: { uk: "Бельсько-Бяла", ru: "Бельско-Бяла", en: "Bielsko-Biała" }, lat: 49.82, lng: 19.04 },
    ],
  },
  {
    id: "france",
    name: { uk: "Франція", ru: "Франция", en: "France" },
    labelOffset: [-42, 6],
    cities: [
      { id: "paris", name: { uk: "Париж", ru: "Париж", en: "Paris" }, lat: 48.86, lng: 2.35, air: true },
      { id: "lyon", name: { uk: "Ліон", ru: "Лион", en: "Lyon" }, lat: 45.76, lng: 4.83 },
      { id: "toulouse", name: { uk: "Тулуза", ru: "Тулуза", en: "Toulouse" }, lat: 43.6, lng: 1.44, air: true },
    ],
  },
  {
    id: "austria",
    name: { uk: "Австрія", ru: "Австрия", en: "Austria" },
    labelOffset: [-36, 23],
    cities: [
      { id: "vienna", name: { uk: "Відень", ru: "Вена", en: "Vienna" }, lat: 48.21, lng: 16.37 },
    ],
  },
  {
    id: "hungary",
    name: { uk: "Угорщина", ru: "Венгрия", en: "Hungary" },
    labelOffset: [12, 20],
    labelAnchor: "start",
    cities: [
      { id: "budapest", name: { uk: "Будапешт", ru: "Будапешт", en: "Budapest" }, lat: 47.5, lng: 19.04 },
    ],
  },
  {
    id: "czechia",
    name: { uk: "Чехія", ru: "Чехия", en: "Czechia" },
    labelOffset: [-18, -28],
    cities: [
      { id: "prague", name: { uk: "Прага", ru: "Прага", en: "Prague" }, lat: 50.08, lng: 14.44 },
      { id: "olomouc", name: { uk: "Оломоуць", ru: "Оломоуц", en: "Olomouc" }, lat: 49.59, lng: 17.25 },
      { id: "brno", name: { uk: "Брно", ru: "Брно", en: "Brno" }, lat: 49.2, lng: 16.61 },
    ],
  },
  {
    id: "slovakia",
    name: { uk: "Словаччина", ru: "Словакия", en: "Slovakia" },
    labelOffset: [3, 50],
    cities: [
      { id: "bratislava", name: { uk: "Братислава", ru: "Братислава", en: "Bratislava" }, lat: 48.15, lng: 17.11 },
    ],
  },
  {
    id: "slovenia",
    name: { uk: "Словенія", ru: "Словения", en: "Slovenia" },
    labelOffset: [0, 22],
    cities: [
      { id: "ljubljana", name: { uk: "Любляна", ru: "Любляна", en: "Ljubljana" }, lat: 46.06, lng: 14.51 },
    ],
  },
  {
    id: "netherlands",
    name: { uk: "Нідерланди", ru: "Нидерланды", en: "Netherlands" },
    labelOffset: [-24, -20],
    cities: [
      { id: "utrecht", name: { uk: "Утрехт", ru: "Утрехт", en: "Utrecht" }, lat: 52.09, lng: 5.12 },
      { id: "amsterdam", name: { uk: "Амстердам", ru: "Амстердам", en: "Amsterdam" }, lat: 52.37, lng: 4.9 },
    ],
  },
  {
    id: "lithuania",
    name: { uk: "Литва", ru: "Литва", en: "Lithuania" },
    labelOffset: [0, -14],
    cities: [
      { id: "vilnius", name: { uk: "Вільнюс", ru: "Вильнюс", en: "Vilnius" }, lat: 54.69, lng: 25.28 },
      { id: "kaunas", name: { uk: "Каунас", ru: "Каунас", en: "Kaunas" }, lat: 54.9, lng: 23.9 },
      { id: "klaipeda", name: { uk: "Клайпеда", ru: "Клайпеда", en: "Klaipėda" }, lat: 55.7, lng: 21.14 },
    ],
  },
  {
    id: "switzerland",
    name: { uk: "Швейцарія", ru: "Швейцария", en: "Switzerland" },
    labelOffset: [-14, 9],
    labelAnchor: "end",
    cities: [
      { id: "zurich", name: { uk: "Цюрих", ru: "Цюрих", en: "Zurich" }, lat: 47.38, lng: 8.54 },
      { id: "bern", name: { uk: "Берн", ru: "Берн", en: "Bern" }, lat: 46.95, lng: 7.45 },
    ],
  },
  {
    id: "georgia",
    name: { uk: "Грузія", ru: "Грузия", en: "Georgia" },
    labelOffset: [0, 17],
    cities: [
      { id: "tbilisi", name: { uk: "Тбілісі", ru: "Тбилиси", en: "Tbilisi" }, lat: 41.72, lng: 44.83, air: true },
    ],
  },
  {
    id: "azerbaijan",
    name: { uk: "Азербайджан", ru: "Азербайджан", en: "Azerbaijan" },
    labelOffset: [0, 17],
    cities: [
      { id: "baku", name: { uk: "Баку", ru: "Баку", en: "Baku" }, lat: 40.41, lng: 49.87, air: true },
    ],
  },
  {
    id: "uk",
    name: { uk: "Велика Британія", ru: "Великобритания", en: "United Kingdom" },
    labelOffset: [-10, -6],
    labelAnchor: "end",
    cities: [
      { id: "london", name: { uk: "Лондон", ru: "Лондон", en: "London" }, lat: 51.51, lng: -0.13, air: true },
    ],
  },
  {
    id: "portugal",
    name: { uk: "Португалія", ru: "Португалия", en: "Portugal" },
    labelOffset: [6, 44],
    labelAnchor: "start",
    cities: [
      { id: "porto", name: { uk: "Порту", ru: "Порту", en: "Porto" }, lat: 41.15, lng: -8.61, air: true },
      { id: "lisbon", name: { uk: "Лісабон", ru: "Лиссабон", en: "Lisbon" }, lat: 38.72, lng: -9.14, air: true },
    ],
  },
  {
    id: "kazakhstan",
    name: { uk: "Казахстан", ru: "Казахстан", en: "Kazakhstan" },
    labelOffset: [8, 20],
    labelAnchor: "end",
    cities: [
      { id: "almaty", name: { uk: "Алмати", ru: "Алматы", en: "Almaty" }, lat: 43.24, lng: 76.95, air: true },
    ],
  },
];

/** Extra non-Ukraine links — examples of the wider network (owner-provided). */
export const NETWORK_LINKS: Array<[string, string]> = [
  ["rome", "warsaw"],
  ["almaty", "marburg"],
  ["milan", "berlin"],
];

/** Schematic hub assignment (owner-approved): one main line per group from a
 *  hub to the country's entry city, thin branches to the rest. Visual balance
 *  over geographic literalism — every hub carries visible routes.
 *  `bow` is the signed arc curvature as a fraction of chord length (positive
 *  bows north, airline-map style) — hand-tuned so routes leaving a hub fan
 *  out at distinct angles. `thick` marks high-frequency trunks. */
export type RouteGroup = {
  hub: string;
  entry: string;
  branches?: string[];
  bow?: number;
  thick?: boolean;
};

export const ROUTE_GROUPS: RouteGroup[] = [
  // Kyiv — northern band (nested westward fan: warsaw lowest, amsterdam highest)
  { hub: "kyiv", entry: "berlin", branches: ["hamburg"], bow: 0.16, thick: true },
  { hub: "kyiv", entry: "warsaw", branches: ["gdansk", "lublin"], bow: 0.1, thick: true },
  { hub: "kyiv", entry: "amsterdam", branches: ["utrecht"], bow: 0.24 },
  { hub: "kyiv", entry: "vilnius", branches: ["kaunas", "klaipeda"], bow: 0.08 },
  { hub: "kyiv", entry: "london", bow: 0.32 },
  // Lviv — central and western Europe (short spokes flat, long air arcs high)
  { hub: "lviv", entry: "krakow", branches: ["przemysl", "bielsko-biala", "wroclaw"], bow: 0.1, thick: true },
  { hub: "lviv", entry: "frankfurt", branches: ["marburg", "cologne", "bonn", "essen", "dusseldorf"], bow: 0.18, thick: true },
  { hub: "lviv", entry: "prague", branches: ["brno", "olomouc"], bow: 0.14 },
  { hub: "lviv", entry: "vienna", bow: 0.12 },
  { hub: "lviv", entry: "bratislava", bow: 0.1 },
  { hub: "lviv", entry: "budapest", bow: 0.08 },
  { hub: "lviv", entry: "ljubljana", bow: 0.12 },
  { hub: "lviv", entry: "zurich", branches: ["bern"], bow: 0.16 },
  { hub: "lviv", entry: "rome", branches: ["milan", "palermo"], bow: 0.22 },
  { hub: "lviv", entry: "paris", branches: ["lyon", "toulouse"], bow: 0.26 },
  { hub: "lviv", entry: "barcelona", branches: ["madrid", "malaga"], bow: 0.3 },
  { hub: "lviv", entry: "lisbon", branches: ["porto"], bow: 0.28 },
  // Odesa — the southern corridor
  { hub: "odesa", entry: "istanbul", branches: ["bursa", "antalya", "alanya"], bow: 0.12 },
  { hub: "odesa", entry: "thessaloniki", bow: 0.14 },
  { hub: "odesa", entry: "tel-aviv", bow: 0.1 },
  // Dnipro / Kharkiv — the Caucasus and Central Asia
  { hub: "dnipro", entry: "tbilisi", bow: 0.14 },
  { hub: "dnipro", entry: "baku", bow: 0.18 },
  { hub: "kharkiv", entry: "almaty", bow: 0.16 },
];

/** Cross-sector routes (owner-requested + trunk joins): extra hub→city links
 *  so every hub radiates in several directions. They join the country trunks
 *  at the entry cities. Southern bows (negative) thread the congested center. */
export type CrossLink = {
  hub: string;
  to: string;
  bow: number;
};

export const CROSS_LINKS: CrossLink[] = [
  { hub: "kharkiv", to: "berlin", bow: 0.14 },
  { hub: "kharkiv", to: "istanbul", bow: -0.14 },
  { hub: "dnipro", to: "warsaw", bow: -0.12 },
  { hub: "dnipro", to: "prague", bow: -0.12 },
  { hub: "kyiv", to: "milan", bow: -0.14 },
  { hub: "odesa", to: "barcelona", bow: -0.12 },
];
