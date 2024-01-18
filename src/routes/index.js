const { Router } = require("express");
const { getProfile } = require("../middlewares/getProfile");
const adminRoutes = require("./admin");
const balanceRoutes = require("./balance");
const contractRoutes = require("./contract");
const jobRoutes = require("./job");

const router = Router();

router.use(
  "/",
  getProfile,
  adminRoutes,
  balanceRoutes,
  contractRoutes,
  jobRoutes
);

module.exports = router;
