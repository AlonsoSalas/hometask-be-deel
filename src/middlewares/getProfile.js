const { AuthorizationError } = require("../errors");
const { Profile } = require("../models");

const getProfile = async (req, res, next) => {
  const profile = await Profile.findOne({
    where: { id: req.get("profile_id") || 0 },
  });
  if (!profile) next(new AuthorizationError());
  req.profile = profile;
  next();
};
module.exports = { getProfile };
