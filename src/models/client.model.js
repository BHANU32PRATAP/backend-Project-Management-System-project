const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

