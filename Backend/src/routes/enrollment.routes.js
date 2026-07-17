const express = require("express");
const router = express.Router();
const { enroll, getMyEnrollments, unenroll } = require("../controllers/enrollment.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);
router.get("/my", getMyEnrollments);
router.post("/:roadmapId", enroll);
router.delete("/:roadmapId", unenroll);

module.exports = router;
