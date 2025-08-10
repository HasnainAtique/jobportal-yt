import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import mongoose from "mongoose";


export const registerCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            });
        }

        let logo = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        company = await Company.create({
            name: companyName,
            description,
            website,
            location,
            logo,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};


export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const file = req.file;
        // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}


export const deleteCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        console.log("Company ID:", companyId);

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Find all jobs related to the company
        const jobs = await Job.find({ company: companyId });

        // Extract and convert job IDs from buffer
        const jobIds = jobs.map(job => {
            const buffer = job._doc._id?.buffer;
            if (!buffer) return null;
            const hex = Buffer.from(buffer).toString("hex");
            return new mongoose.Types.ObjectId(hex);
        }).filter(id => id !== null);

        console.log("Job IDs to delete:", jobIds);

        // Delete applications related to the jobs
        const deletedApplications = await Application.deleteMany({ job: { $in: jobIds } });
        console.log("Applications deleted:", deletedApplications.deletedCount);

        // Delete jobs
        const deletedJobs = await Job.deleteMany({ company: companyId });
        console.log("Jobs deleted:", deletedJobs.deletedCount);

        // Delete company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company, its jobs, and all related applications deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({
            message: "Server error while deleting company.",
            success: false
        });
    }
};

