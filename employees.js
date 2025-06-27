const express = require("express");
const router = express.Router();

let employees = []; // In-memory storage

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: Naveen
 *               department:
 *                 type: string
 *                 example: IT
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 */
router.post("/employees", (req, res) => {
  const { name, department } = req.body;
  if (!name || !department) {
    return res.status(400).json({ error: "Name and department are required" });
  }

  const newEmployee = { id: employees.length + 1, name, department };
  employees.push(newEmployee);
  res.status(201).json({ message: "Employee created successfully", data: newEmployee });
});

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   department:
 *                     type: string
 */
router.get("/employees", (req, res) => {
  res.status(200).json(employees);
});

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 */
router.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, department } = req.body;
  const empIndex = employees.findIndex((e) => e.id === parseInt(id));
  if (empIndex === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }

  if (name) employees[empIndex].name = name;
  if (department) employees[empIndex].department = department;

  res.status(200).json({ message: "Employee updated", data: employees[empIndex] });
});

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const empIndex = employees.findIndex((e) => e.id === parseInt(id));
  if (empIndex === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }

  employees.splice(empIndex, 1);
  res.status(200).json({ message: "Employee deleted successfully" });
});

module.exports = router;
