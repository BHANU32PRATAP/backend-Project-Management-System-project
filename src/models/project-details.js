const mongoose = require("mongoose");

const projectDetailsShema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
      unique: true,
    },
    projectOverrView: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    projectURL: {
      type: String,
      require,
      unique: true,
    },
    technologies: {
      type: String,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("projectDetails", projectDetailsShema);
