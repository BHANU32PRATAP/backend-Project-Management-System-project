const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
} = require("../controllers/task.controller.js");

router.post("/create-task", createTask);
router.get("/task-list", getAllTasks);

module.exports = router;
