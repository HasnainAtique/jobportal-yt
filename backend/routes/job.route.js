import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, deleteJobs, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get( getAdminJobs);
router.route("/get/:id").get( getJobById);
router.route("/delete/:id").delete( deleteJobs);
router.route("/update/:id").put(isAuthenticated, updateJob);
export default router;

