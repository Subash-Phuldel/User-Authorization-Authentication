const express = require("express");
const contentController = require("../controllers/contentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/user").get(authController.protect, contentController.getContent);
router
  .route("/admin")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    contentController.getContentForAdmin
  );

module.exports = router;
