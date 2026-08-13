//* Seeds hawker centres, stalls and dishes with correct ObjectId references.
//* The in-controller /seed routes hardcode 2021 ObjectIds that no longer exist,
//* so they produce dangling references — this builds the graph bottom-up instead.
//*
//*   node scripts/seed.js            insert (aborts if data already present)
//*   node scripts/seed.js --reset    wipe the three collections first
require("dotenv").config();
const mongoose = require("mongoose");
const Dishes = require("../models/dishes");
const HawkerStalls = require("../models/hawkerStalls");
const HawkerCentre = require("../models/hawkerCentre");

// Wikimedia Commons redirects Special:FilePath to the current file and allows hotlinking.
const img = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;

const CENTRES = [
  {
    name: "Maxwell Food Centre",
    address: {
      street_address: "1, Kadayanallur Street",
      postal_code: "069184",
    },
    description:
      "Singapore's favourite tourist-approved hawker centre. Tian Tian Chicken Rice is the headline act (Anthony Bourdain-approved, mind you), but Zhen Zhen Porridge and Maxwell Fuzhou Oyster Cake hold their own.",
    stalls: [
      {
        name: "Tian Tian Hainanese Chicken Rice",
        operating_hours: "1000 - 1930",
        closed_days: "Monday",
        unit_number: "01-10",
        score: 9,
        image_url: img("Hainanese_chicken_rice.jpg"),
        dishes: [{ name: "Hainanese Chicken Rice", cuisine: "chinese" }],
      },
      {
        name: "Maxwell Fuzhou Oyster Cake",
        operating_hours: "0900 - 2000",
        closed_days: "Sunday",
        unit_number: "01-05",
        score: 10,
        image_url: img("Oyster_omelette.jpg"),
        dishes: [{ name: "Fuzhou Oyster Cake", cuisine: "chinese" }],
      },
      {
        name: "Zhen Zhen Porridge",
        operating_hours: "0530 - 1430",
        closed_days: "Tuesday",
        unit_number: "01-54",
        score: 8,
        image_url: img("Chwee_kueh.jpg"),
        dishes: [{ name: "Century Egg Porridge", cuisine: "chinese" }],
      },
      {
        name: "Hup Kee Wanton Noodle",
        operating_hours: "1030 - 2000",
        closed_days: "Wednesday",
        unit_number: "01-92",
        score: 7,
        image_url: img("Wantan_mee.jpg"),
        dishes: [{ name: "Wanton Noodles", cuisine: "chinese" }],
      },
    ],
  },
  {
    name: "Adam Road Food Centre",
    address: { street_address: "2, Adam Road", postal_code: "289877" },
    description:
      "Small but mighty. Adam Road counts famous stalls such as Selera Rasa Nasi Lemak as tenants, and the queue at lunch is the proof.",
    stalls: [
      {
        name: "Selera Rasa Nasi Lemak",
        operating_hours: "0700 - 2100",
        closed_days: "Open daily",
        unit_number: "01-02",
        score: 10,
        image_url: img("Nasi_lemak.jpg"),
        dishes: [{ name: "Nasi Lemak", cuisine: "malay" }],
      },
      {
        name: "Adam Road Prata House",
        operating_hours: "0600 - 2200",
        closed_days: "Open daily",
        unit_number: "01-08",
        score: 8,
        image_url: img("Roti_prata.jpg"),
        dishes: [{ name: "Roti Prata", cuisine: "indian" }],
      },
      {
        name: "Salim Mutton Satay",
        operating_hours: "1600 - 2300",
        closed_days: "Monday",
        unit_number: "01-14",
        score: 9,
        image_url: img("Satay.jpg"),
        dishes: [{ name: "Mutton Satay", cuisine: "malay" }],
      },
    ],
  },
  {
    name: "Old Airport Road Food Centre",
    address: { street_address: "51, Old Airport Road", postal_code: "390051" },
    description:
      "The hawker centre other hawker centres measure themselves against. Two floors of institutions, most of them run by the same family for decades.",
    stalls: [
      {
        name: "Lao Fu Zi Fried Kway Teow",
        operating_hours: "1130 - 2130",
        closed_days: "Thursday",
        unit_number: "01-12",
        score: 9,
        image_url: img("Char_kway_teow.jpg"),
        dishes: [{ name: "Char Kway Teow", cuisine: "chinese" }],
      },
      {
        name: "Toa Payoh Rojak",
        operating_hours: "1200 - 2000",
        closed_days: "Monday",
        unit_number: "01-108",
        score: 8,
        image_url: img("Chai_tow_kway.jpg"),
        dishes: [{ name: "Fried Carrot Cake", cuisine: "chinese" }],
      },
      {
        name: "Xin Mei Xiang Lor Mee",
        operating_hours: "0630 - 1500",
        closed_days: "Wednesday",
        unit_number: "01-116",
        score: 9,
        image_url: img("Laksa.jpg"),
        dishes: [{ name: "Katong Laksa", cuisine: "peranakan" }],
      },
      {
        name: "Old Airport Bak Kut Teh",
        operating_hours: "0800 - 1900",
        closed_days: "Tuesday",
        unit_number: "01-122",
        score: 7,
        image_url: img("Bak_kut_teh.jpg"),
        dishes: [{ name: "Bak Kut Teh", cuisine: "chinese" }],
      },
    ],
  },
];

const run = async () => {
  const reset = process.argv.includes("--reset");
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  const existing = await HawkerCentre.countDocuments();
  if (existing > 0 && !reset) {
    throw new Error(
      `${existing} hawker centres already exist — rerun with --reset to replace them`,
    );
  }
  if (reset) {
    await Promise.all([
      HawkerCentre.deleteMany({}),
      HawkerStalls.deleteMany({}),
      Dishes.deleteMany({}),
    ]);
    console.log("cleared existing centres, stalls and dishes");
  }

  for (const centre of CENTRES) {
    const stallIds = [];
    for (const stall of centre.stalls) {
      const dishes = await Dishes.create(stall.dishes);
      const created = await HawkerStalls.create({
        name: stall.name,
        operating_hours: stall.operating_hours,
        closed_days: stall.closed_days,
        unit_number: stall.unit_number,
        score: stall.score,
        image_url: stall.image_url,
        dishes: dishes.map((d) => d._id),
      });
      stallIds.push(created._id);
    }
    await HawkerCentre.create({
      name: centre.name,
      address: centre.address,
      description: centre.description,
      hawker_stalls: stallIds,
    });
    console.log(`seeded ${centre.name} (${stallIds.length} stalls)`);
  }

  const [centres, stalls, dishes] = await Promise.all([
    HawkerCentre.countDocuments(),
    HawkerStalls.countDocuments(),
    Dishes.countDocuments(),
  ]);
  console.log(`done: ${centres} centres, ${stalls} stalls, ${dishes} dishes`);
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
