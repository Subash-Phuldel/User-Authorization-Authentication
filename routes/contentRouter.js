const express = require("express");
const contentController = require("../controllers/contentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(contentController.getContent);

module.exports = router;
