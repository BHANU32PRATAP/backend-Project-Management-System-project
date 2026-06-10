const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    secondName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: [
            'admin',
            'project-manager',
            'team-lead',
            'employee',
            'hr',
        ],
        default: 'employee'
    },
    term: {
        type: Boolean,
        required: [true, "Terms acceptance is required"],
        default: false
    }

}, { timestamps: true })


module.exports = mongoose.model("User", userSchema)