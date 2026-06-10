const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

const {
  isValidEmail,
  passwordStrength,
} = require("../utils/validators.utils.js");

const registerUser = async (req, res) => {
  try {
    let {
      firstName,
      secondName,
      email,
      password,
      confirmPassword,
      role,
      term,
    } = req.body;

    firstName = firstName?.trim();
    secondName = secondName?.trim();
    email = email?.trim().toLowerCase();

    if (!firstName || !secondName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    
    if (firstName.length < 4 || secondName.length < 4) {
      return res.status(400).json({
        success: false,
        message: "First name must be at least 2 characters",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    if (!passwordStrength(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain uppercase, lowercase and number",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Terms and Conditions acceptance is required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      secondName,
      email,
      password: hashedPassword,
      role: role || "employee",
      term,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        role: user.role,
        term: user.term,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Register Error ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        role: user.role,
        term: user.term,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
