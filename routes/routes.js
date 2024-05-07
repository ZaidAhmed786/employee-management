const express = require("express");
const router = express.Router();
const upload = require("../middleware/MulterMiddleware");

//-- *********** Import Controller Functions *********** --//
const UserController = require("../controllers/UserController");
const SalaryController = require("../controllers/SalaryController");
const SalesController = require("../controllers/SalesController");
const AuthController = require("../controllers/AuthController");
//!!  ********************* Routes ********************* --//
require("dotenv").config();

router.get("/", (req, res) => {
  res.send("Leilani Employee Management System");
});

// Login Route
router.post("/login", AuthController.login);

//! *** Salary Routes *** !//
router
  .route("/api/salary")
  .get(SalaryController.getSalaries) /*** Get all Salaries ***/
  .post(SalaryController.addSalary); /*** Add New Salary ***/
router
  .route("/api/salary/:id")
  .get(SalaryController.getSingleSalary) /*** Get a Single Salary ***/
  .patch(SalaryController.updateSalary) /*** Update Salary ***/
  .delete(SalaryController.deleteSalary); /*** Remove Salary ***/

//! *** Sales Routes ***!//
router
  .route("/api/sales")
  .get(SalesController.getSales) /*** Get all Sales ***/
  .post(SalesController.addSales); /*** Add New Sales ***/
router
  .route("/api/sales/:id")
  .get(SalesController.getSingleSale) /*** Get a Single Sales ***/
  .patch(SalesController.updateSale) /*** Update Sales ***/
  .delete(SalesController.deleteSale); /*** Remove Sales ***/

//! *** Users Routes ***!//
router
  .route("/api/users")
  .get(UserController.get_users) /*** Get all Users ***/
  .post(UserController.add_user); /*** Add New Users ***/
router
  .route("/api/users/:id")
  .get(UserController.get_single_user) /*** Get a Single User ***/
  .patch(UserController.update_user) /*** Update Users ***/
  .delete(UserController.remove_user); /*** Remove Users ***/

router.all("*", (req, res) => {
  res.send("Route not found");
});

module.exports = router;
