const express = require("express");
const router = express.Router({ mergeParams: true });
const { getByRoadmap, create, update, remove } = require("../controllers/module.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", getByRoadmap);
router.post("/", protect, authorize("admin", "instructor"), create);
router.put("/:id", protect, authorize("admin", "instructor"), update);
router.delete("/:id", protect, authorize("admin", "instructor"), remove);

module.exports = router;
