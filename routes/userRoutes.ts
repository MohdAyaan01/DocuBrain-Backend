import express from "express";
import {Login,Logout,SignUp} from "../controllers/userController.js";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.route("/signup").post(SignUp);
router.route("/login").post(Login);
router.route("/logout").post(Logout);
router.route("/google").post(googleAuth);

export default router;