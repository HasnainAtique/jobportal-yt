import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, handleMulterError } from "../middlewares/mutler.js";
 
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "✅ User route working!" });
});

router.route("/register").post(singleUpload, handleMulterError, register);

router.route("/login").post(login);

router.route("/logout").get(logout);

// ✅ Profile update route with proper middleware order
router.route("/profile/update").post(
  isAuthenticated,    // First: Check authentication
  singleUpload,       // Second: Handle file upload
  handleMulterError,  // Third: Handle upload errors
  updateProfile       // Fourth: Process the request
);

export default router;