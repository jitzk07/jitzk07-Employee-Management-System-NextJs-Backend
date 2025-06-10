const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Employee routes
router.post(
  '/create',
  protect,
  authorizeRoles('admin'), 
  employeeController.createEmployee
);

router.get(
  '/getAll',
  protect,
  authorizeRoles('admin',"employee"), 
  employeeController.getAllEmployees
);

router.get(
  '/:id',
  protect,
  authorizeRoles('admin'),
  employeeController.getEmployeeById
);

router.put(
  '/:id',
  protect,
  authorizeRoles('admin'), 
  employeeController.updateEmployee
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'), 
  employeeController.deleteEmployee
);

router.get(
  '/department/:departmentId',
  protect,
  authorizeRoles('admin'),
  employeeController.getEmployeesByDepartment
);

module.exports = router;