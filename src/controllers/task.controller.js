const Task = require("../models/task.model.js");

const createTask = async (req, res) => {
  try {
    const {
      taskName,
      description,
      project,
      assignedTo,
      assignedBy,
      status,
      priority,
      progress,
      startDate,
      deadline,
      completedAt,
      estimatedHours,
      actualHours,
      tags,
      isActive,
    } = req.body;

    if (
      (!taskName.trim() || !description.trim() || !project,
      !assignedTo,
      !assignedBy,
      !status,
      !priority,
      !progress,
      !startDate,
      !deadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const task = await Task.create({
      taskName: taskName.trim(),
      description: description.trim(),
      project,
      assignedTo,
      assignedBy,
      status,
      priority,
      progress,
      startDate,
      deadline,
      completedAt,
      estimatedHours,
      actualHours,
      tags,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.error).forEach((key) => {
        validationErrors[key] = key.error.error[key].message;
      });

      return res.status(400).json({
        success: false,
        error: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, priority } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        {
          taskName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status && status === "All Status") {
      query.status = status;
    }
    if (priority && priority !== "All Status") {
      query.status = status;
    }

    query.isActive = true;

    const totalTask = await Task.countDocuments(query);

    const task = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    return res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTask / Number(limit)),
      totalTask,
      data: task,
    });
  } catch (error) {
    console.log("Get Project Error", error);
    return res.status(500).json({
      success: false,
      messages: "Internal Server Error",
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
};
