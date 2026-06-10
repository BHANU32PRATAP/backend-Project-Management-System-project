const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
      minlength: [3, "Task name must be at least 3 characters"],
      maxlength: [100, "Task name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project is required"],
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: [true, "Employee is required"],
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Assigned by is required"],
    },

    status: {
      type: String,
      required: [true, "Task status is required"],
      enum: {
        values: ["Todo", "In Progress", "In Review", "Completed", "Blocked"],
        message: `{VALUE} is not a valid task status`,
      },
      default: "Todo",
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: `{VALUE} is not a valid task priority`,
      },
      default: "Medium",
    },

    progress: {
      type: Number,
      required: [true, "Task progress is required"],
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
      default: 0,
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

    completedAt: {
      type: Date,
    },

    estimatedHours: {
      type: Number,
      default: 0,
      min: [0, "Estimated hours cannot be negative"],
    },

    actualHours: {
      type: Number,
      default: 0,
      min: [0, "Actual hours cannot be negative"],
    },

    tags: [
      {
        type: String,
        trim: true,
        required: [true, "At least one tag is required"],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("task", taskSchema);
