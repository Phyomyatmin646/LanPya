const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", protect, authorize("admin"), create);
router.put("/:id", protect, authorize("admin"), update);
router.delete("/:id", protect, authorize("admin"), remove);

module.exports = router;
