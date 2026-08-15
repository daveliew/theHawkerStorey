//* Guard for the legacy /seed routes: unauthenticated GETs that write to the DB.
//* Fails CLOSED — an unset NODE_ENV (plain `node server.js` on a VPS, a new host)
//* must not expose them, so seeding requires an explicit opt-in.
const devOnly = (req, res, next) => {
  const enabled =
    process.env.SEED_ROUTES_ENABLED === "true" ||
    process.env.NODE_ENV === "development";
  if (!enabled) return res.sendStatus(404);
  next();
};

module.exports = devOnly;
