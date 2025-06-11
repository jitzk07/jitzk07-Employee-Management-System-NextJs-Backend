const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  departmentController.createDepartment
);

router.get(
  "/getAll",
  protect,
  authorizeRoles("admin","employee"),
  departmentController.getAllDepartments
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  departmentController.getDepartmentById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  departmentController.deleteDepartment
);

module.exports = router;
