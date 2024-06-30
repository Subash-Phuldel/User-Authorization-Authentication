const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const mongoose = require("mongoose");

process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION , SHUTTING DOWN");
  console.log(err);
  process.exit(1);
});

const app = require("./app");

(async () => {
  try {
    const con = await mongoose.connect(process.env.DATABASE_LOCAL, {});
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
  }
})();

const port = process.env.PORT || 3000;

const server = app.listen(port, "127.0.0.1", () => {
  console.log(`Server is listening at port ${port}`);
});

process.on("unhandledRejection", function (err) {
  console.log("UNHANDLED REJECTION, SHUTTING DOWN");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
