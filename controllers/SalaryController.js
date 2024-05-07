const Salary = require("../models/SalarySchema");

module.exports = {
  /*** Create Salary ***/
  addSalary: async (req, res) => {
    try {
      const { employeeId, basicSalary, deductions, leaveDeductionRate } = req.body;
      const newSalary = new Salary({
        employeeId,
        basicSalary,
        deductions,
        leaveDeductionRate,
      });
      const salary = await newSalary.save();
      res.status(200).json({ status: "success", data: salary });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Salaries ***/
  getSalaries: async (req, res) => {
    try {
      const salaries = await Salary.find();
      res.status(200).json({ status: "success", data: salaries });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Salary ***/
  getSingleSalary: async (req, res) => {
    try {
      const salary = await Salary.findById(req.params.id);
      res.status(200).json({ status: "success", data: salary });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Salary ***/
  updateSalary: async (req, res) => {
    try {
      const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ status: "success", data: salary });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Salary ***/
  deleteSalary: async (req, res) => {
    try {
      await Salary.findByIdAndDelete(req.params.id);
      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
