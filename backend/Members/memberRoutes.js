const express = require("express");
const router = express.Router();

// user dashboard route
router.get("/UserDashboard", function (req, res) {
  res.send("UserDashboard");
});

// user benefits
router.get("/UserDashBenefits", function (req, res) {
  res.send("About this wiki");
});

module.exports = router;