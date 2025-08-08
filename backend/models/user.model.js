// models/User.js - Updated Schema
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        // ✅ Resume stored as Base64 string
        resume: { 
            type: String, // Will store base64 data URI
        },
        resumeOriginalName: { type: String },
        resumeSize: { type: Number }, // File size in bytes
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);