const express = require("express");
const router = express.Router({ mergeParams: true });
const { getByModule, getById, create, update, remove } = require("../controllers/lesson.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", getByModule);
router.get("/:id", getById);
router.post("/", protect, authorize("admin", "instructor"), create);
router.put("/:id", protect, authorize("admin", "instructor"), update);
router.delete("/:id", protect, authorize("admin", "instructor"), remove);

module.exports = router;
