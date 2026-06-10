const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProject,
  deletedProject,
} = require("../controllers/project.controller.js");

router.post("/create-project", createProject);
router.get("/project-list", getAllProject);
router.delete("/delete-project/:id", deletedProject);

module.exports = router;
