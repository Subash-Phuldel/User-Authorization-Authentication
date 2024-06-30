const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const mongoose = require("mongoose");
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

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is listening at port ${port}`);
});
