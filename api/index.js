//* Vercel serverless entry — all /v1/* requests are rewritten here (see vercel.json)
//* and Express routes them by their original URL.
module.exports = require("../app");
