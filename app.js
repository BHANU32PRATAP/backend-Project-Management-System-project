const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/user.routes");

////project.routes/////
const projectRoutes = require("./src/routes/project.routes.js");

////task/////
const taskRoutes = require("./src/routes/task.routes.js");

const app = express();

app.use(cors());

app.use(express.json());

// Routes
///////user API link//////
app.use("/api", authRoutes);

///////project API link//////
app.use("/api/projects", projectRoutes);

///////Task API link//////
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;
