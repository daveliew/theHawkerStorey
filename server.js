//* Local/long-running entry point. On Vercel the app is served via api/index.js instead.
const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Listening on the port", PORT);
});
