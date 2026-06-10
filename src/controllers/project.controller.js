const Project = require("../models/project.model.js");
const { MIN_PROGRESS, MAX_PROGRESS } = require("../config/constants.js");

const createProject = async (req, res) => {
  try {
    let {
      projectName,
      projectCode,
      client,
      manager,
      budget,
      progress,
      status,
      priority,
      startDate,
      deadline,
    } = req.body;

    if (
      !projectName?.trim() ||
      !projectCode?.trim() ||
      !client?.trim() ||
      !manager?.trim() ||
      budget === undefined ||
      progress === undefined ||
      !status?.trim() ||
      !priority?.trim() ||
      !startDate ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    projectName = projectName.trim();
    projectCode = projectCode.trim();
    client = client.trim();
    manager = manager.trim();

    if (progress < MIN_PROGRESS || progress > MAX_PROGRESS) {
      return res.status(400).json({
        success: false,
        message: `Progress must be between ${MIN_PROGRESS} and ${MAX_PROGRESS}`,
      });
    }

    const projectCodeRexjs = /^PRJ-\d{4}$/;
    if (!projectCodeRexjs.test(projectCode)) {
      return res.status(400).json({
        success: false,
        message: "Project code must be like PRJ-1001",
      });
    }

    if (new Date(deadline) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be after start date",
      });
    }

    const existingProject = await Project.findOne({
      projectCode,
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "Project code already exists",
      });
    }

    const project = await Project.create({
      projectName,
      projectCode,
      client,
      manager,
      budget,
      progress,
      status,
      priority,
      startDate,
      deadline,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        error: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllProject = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, priority } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        {
          projectName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          projectCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          client: {
            $regex: search,
            $options: "i",
          },
        },
        {
          manager: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status && status !== "All Status") {
      query.status = status;
    }
    if (priority && priority !== "All Priority") {
      query.priority = priority;
    }

    // exclude soft-deleted projects
    query.isActive = true;

    const totalProjects = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    return res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProjects / Number(limit)),
      totalProjects,
      data: projects,
    });
  } catch (error) {
    console.log("Get Projects Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deletedProject = async (req, res) => {
  try {
    console.log("DELETE ID =>", req.params.id);

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createProject,
  getAllProject,
  deletedProject,
};
