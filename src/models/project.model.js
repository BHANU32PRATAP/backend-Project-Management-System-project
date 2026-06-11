const mongoose = require("mongoose");
const {
  MIN_PROGRESS,
  MAX_PROGRESS,

  PROJECT_NAME_MIN_LENGTH,
  PROJECT_NAME_MAX_LENGTH,

  DESCRIPTION_MAX_LENGTH,

  CLIENT_MAX_LENGTH,
  CLIENT_MIN_LENGTH,

  MANAGER_MAX_LENGTH,
  MANAGER_MIN_LENGTH,

  OVERVIEW_MAX_LENGTH,

  NOTES_MAX_LENGTH,
} = require("../config/constants.js");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [
        PROJECT_NAME_MIN_LENGTH,
        `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`,
      ],
      maxlength: [
        PROJECT_NAME_MAX_LENGTH,
        `Project name cannot exceed ${PROJECT_NAME_MAX_LENGTH} characters`,
      ],
    },

    projectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    client: {
      type: String,
      required: true,
      minlength: [
        CLIENT_MIN_LENGTH,
        `Client name must be at least ${CLIENT_MIN_LENGTH} characters`,
      ],
      maxlength: [
        CLIENT_MAX_LENGTH,
        `Client name cannot exceed ${CLIENT_MAX_LENGTH} characters`,
      ],
      trim: true,
    },

    manager: {
      type: String,
      required: true,
      trim: true,
      minlength: [
        MANAGER_MIN_LENGTH,
        `Manager name must be at least ${MANAGER_MIN_LENGTH} characters`,
      ],
      maxlength: [
        MANAGER_MAX_LENGTH,
        `Manager name cannot exceed ${MANAGER_MAX_LENGTH} characters`,
      ],
    },

    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },

    progress: {
      type: Number,
      default: MIN_PROGRESS,
      min: [MIN_PROGRESS, `Progress cannot be less than ${MIN_PROGRESS}`],
      max: [MAX_PROGRESS, `Progress cannot be greater than ${MAX_PROGRESS}`],
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "In Progress", "Completed"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: "Deadline must be after start date",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("project", projectSchema);
