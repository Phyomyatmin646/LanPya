const ApiResponse = require("../utils/apiResponse");

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role_id?.name)) {
      return res
        .status(403)
        .json(ApiResponse.error(`Role '${req.user?.role_id?.name}' is not authorized`, 403));
    }
    next();
  };
};
